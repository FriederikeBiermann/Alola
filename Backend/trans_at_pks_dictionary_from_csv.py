import pandas as pd
import numpy as np

dataset= pd.read_csv("/home/friederike/Dokumente/Arbeit/Kollaborationen/Antismash/TransATor/TransPACT Table.csv")
dictionary_clades_tailorings={}
for row in dataset.itertuples():
    # try:
    #     if len(row[9])>0:
    #         dictionary_clades_tailorings[row[3]]=row[9].split(",")
    # except : dictionary_clades_tailorings[row[3]]=[]
    # print(row[12])
    #try:
        print(type(row[10]))
        if type(row[10])!="float":
            dictionary_clades_tailorings[row[3]]=row[10]
        else: dictionary_clades_tailorings[row[3]]="OC(=O)CC(S)=O"
    #except : pass
    # print(row[12])
    # try:
    #
    #         dictionary_clades_tailorings[row[2].replace("_","")]=row[3]
    # except : pass
print(dictionary_clades_tailorings)
