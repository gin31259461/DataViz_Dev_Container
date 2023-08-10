from pathlib import Path
import sys

sys.path.insert(1, f'{Path(__file__).parent.parent.absolute()}/classification')
from decisionTree import decisionTreeHandler

from flask import Flask, request
from flask_cors import CORS
import json
from sqlalchemy import text
import tempfile
import pandas as pd
from pandas.core.api import DataFrame
from setup import use_mssql_connection

db = use_mssql_connection()

server = Flask(__name__)
CORS(server)

def data_to_sql(data: DataFrame, lastID="0"):
    df = pd.DataFrame(data)
    df.to_sql("D" + lastID, db, if_exists="replace", index=False, schema="dbo")

@server.route("/api/uploadCsv", methods=["POST"])
def upload_router():
    lastID = request.form["lastID"]
    if request.files:
        csvFile = request.files["file"]
        tempFile = tempfile.NamedTemporaryFile(delete=True)
        csvFile.save(tempFile.name)
        with open(tempFile.name, "rb") as f:
            data = pd.read_csv(f, encoding="utf-8")
            print(data)
            data_to_sql(data, lastID)
    elif request.form["url"]:
        url = request.form["url"]
        data = pd.read_csv(url, encoding="utf-8")
        print(data)
        data_to_sql(data, lastID)

    return "upload csv successfully"


@server.route("/api/decisionTree", methods=["GET"])
def decision_tree_router():
    result = db.execute(text("select * from RawDB.dbo.D" + request.args.get("oid")))
    df = pd.DataFrame(result.fetchall(), columns=result.keys())
    result = decisionTreeHandler(df, request.args.get("target"), request.args.get("features").split(","))
    return json.dumps(result)

if __name__ == '__main__':
    server.run(debug=True, host="localhost", port=3090)
