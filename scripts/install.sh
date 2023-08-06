#!/bin/bash

sudo chown node frontend/node_modules
sudo chown node library/d3chart/node_modules

sudo chown -R node /usr/local/conda/pkgs/cache

conda update -y -n base conda
conda update -y -n base anaconda
conda install -y flask-cors
conda install -y graphviz
pip install graphviz