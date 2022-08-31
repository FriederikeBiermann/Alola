from __future__ import annotations
from re import A
from xml.sax.handler import all_features
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.SeqFeature import SeqFeature, FeatureLocation
from os import scandir
from Bio import AlignIO
dictionary_clades_to_fasta_transator={}

import pandas as pd
import numpy as np

dataset= pd.read_csv("/home/friederike/Dokumente/Arbeit/Kollaborationen/Antismash/TransATor/TransPACT Table.csv")
dictionary_clades_tailorings={}
for row in dataset.itertuples():
    # try:
    #     if len(row[9])>0:
    #         dictionary_clades_tailorings[row[3]]=row[9].split(",")
    # except : print(row)
    # print(row[12])
    # try:
    #
    #     if row[12]>0:
    #         dictionary_clades_tailorings[row[3]]="non-elongating"
    #     else: dictionary_clades_tailorings[row[3]]="elongating"
    # except : pass
    # print(row[12])
    try:

            dictionary_clades_tailorings[row[2].replace("_","")]=row[3]
    except : pass
leaf_to_clade_transpact=dictionary_clades_tailorings
with scandir("/home/friederike/Downloads/transator-master/cladification/ks_hmmer_models/alignment/") as it:
#with scandir("C:\\Users\\Joe Satt\\OneDrive\\Uni\\MSc MBW\\2. Semester\\Biosynthese von Naturstoffen\\Praktikum\\Datensatz_klein\\") as it:
# alles was im Ordnder Praktum liegt und mit gbk endet und ein file ist wird hier durchgezogen und geparst

    for indi_file in it:
            print(indi_file.name)
            #indi_file = "C:\\Users\\Joe Satt\\OneDrive\\Uni\\MSc MBW\\2. Semester\\Biosynthese von Naturstoffen\\Praktikum\\indigoidine_nrps.gbk"
            for indi_record in AlignIO.read("/home/friederike/Downloads/transator-master/cladification/ks_hmmer_models/alignment/"+indi_file.name, "fasta"):

                dictionary_clades_to_fasta_transator[indi_record.id.replace("_","")]=str(indi_file.name.split(".")[0])
leaf_to_clade_transator=dictionary_clades_to_fasta_transator
print(leaf_to_clade_transator,leaf_to_clade_transpact)
clade_mapping_dictionary={}# keys are from transator, clades from transpact
for key_transator in leaf_to_clade_transator.keys():
    clade_transator= leaf_to_clade_transator[key_transator]
    try:
        clade_transpact=leaf_to_clade_transpact[key_transator]
        clade_mapping_dictionary[clade_transator]=clade_transpact
    except: print(key_transator)
print(clade_mapping_dictionary)
for number in range(1,170):
    Cladename="Clade_"+str(number)
    try:
        test=clade_mapping_dictionary[Cladename]
    except:
        print(Cladename)
