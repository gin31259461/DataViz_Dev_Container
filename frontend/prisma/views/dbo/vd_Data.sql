SELECT
  O.OID AS id,
  O.CName AS name,
  O.CDes AS description,
  O.OwnerMID AS ownerID,
  CONVERT(VARCHAR, O.Since, 20) AS since,
  CONVERT(VARCHAR, O.LastModifiedDT, 20) AS lastModified,
  O.nClick AS frequency,
  D.MD5 AS md5
FROM
  OBJECT AS O,
  Data AS D
WHERE
  TYPE = 6
  AND O.OID = D.DID;