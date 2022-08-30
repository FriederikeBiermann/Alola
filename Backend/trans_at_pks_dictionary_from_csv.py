import pandas as pd
import numpy as np

dataset= pd.read_csv("/home/friederike/Documents/Kollaborations/Antismash/TransATor/TransPACT Table.csv")
dictionary_clades_tailorings={}
for row in dataset.itertuples():
    # try:
    #     if len(row[9])>0:
    #         dictionary_clades_tailorings[row[3]]=row[9].split(",")
    # except : print(row)
    print(row[12])
    try:

        if row[12]>0:
            dictionary_clades_tailorings[row[3]]="non-elongating"
        else: dictionary_clades_tailorings[row[3]]="elongating"
    except : pass
print(dictionary_clades_tailorings)
