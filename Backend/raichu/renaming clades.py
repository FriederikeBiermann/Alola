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
with scandir("/home/friederike/Downloads/transator-master/cladification/ks_hmmer_models/alignment/") as it:
#with scandir("C:\\Users\\Joe Satt\\OneDrive\\Uni\\MSc MBW\\2. Semester\\Biosynthese von Naturstoffen\\Praktikum\\Datensatz_klein\\") as it:
# alles was im Ordnder Praktum liegt und mit gbk endet und ein file ist wird hier durchgezogen und geparst

    for indi_file in it:
            print(indi_file.name)
            #indi_file = "C:\\Users\\Joe Satt\\OneDrive\\Uni\\MSc MBW\\2. Semester\\Biosynthese von Naturstoffen\\Praktikum\\indigoidine_nrps.gbk"
            for indi_record in AlignIO.read("/home/friederike/Downloads/transator-master/cladification/ks_hmmer_models/alignment/"+indi_file.name, "fasta"):
                split_id=indi_record.id.split("_")
                try:
                    changed_id=split_id[0]+"_"+split_id[1]+split_id[2]+"_"+split_id[3]+"_"+"".join(split_id[4:])
                except:
                    changed_id=split_id[0]+"_"+split_id[1]+split_id[2]+"_"+"".join(split_id[3:])

                dictionary_clades_to_fasta_transator[changed_id]=str(indi_file.name.split(".")[0])
                try:
                    changed_id=split_id[0]+"_"+split_id[1]+"_"+split_id[2]+split_id[3]+"_"+"".join(split_id[4:])
                except:
                    changed_id=split_id[0]+"_"+split_id[1]+"_"+split_id[2]+"_"+"".join(split_id[3:])
                dictionary_clades_to_fasta_transator[changed_id]=str(indi_file.name.split(".")[0])

                print(changed_id)
                dictionary_clades_to_fasta_transator[changed_id]=str(indi_file.name.split(".")[0])

print(dictionary_clades_to_fasta_transator)
