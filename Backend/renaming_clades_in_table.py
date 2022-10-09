import pandas as pd
import numpy as np

dataset= pd.read_csv("/home/friederike/Documents/Kollaborations/Antismash/TransATor/TransPACT Table.csv")
transator_clade_to_transpact_clade={'Clade_142': 'Clade_74', 'Clade_40': 'Clade_29', 'Clade_46': 'Clade_34', 'Clade_98': 'Clade_126', 'Clade_92': 'Clade_34', 'Clade_125': 'Clade_64', 'Clade_9': 'Clade_10', 'Clade_95': 'Clade_123', 'Clade_141': 'Clade_47', 'Clade_35': 'Clade_11', 'Clade_28': 'Clade_1', 'Clade_138': 'Clade_80', 'Clade_94': 'Clade_49', 'Clade_139': 'Clade_79', 'Clade_112': 'Clade_80', 'Clade_111': 'Clade_80', 'Clade_80': 'Clade_60', 'Clade_25': 'Clade_12', 'Clade_127': 'Clade_66', 'Clade_2': 'Clade_89', 'Clade_44': 'Clade_33', 'Clade_45': 'Clade_33', 'Clade_78': 'Clade_36', 'Clade_7': 'Clade_111', 'Clade_140': 'Clade_116', 'Clade_12': 'Clade_39', 'Clade_96': 'Clade_105', 'Clade_121': 'Clade_53', 'Clade_11': 'Clade_12', 'Clade_82': 'Clade_64', 'Clade_67': 'Clade_92', 'Clade_116': 'Clade_71', 'Clade_26': 'Clade_23', 'Clade_8': 'Clade_6', 'Clade_81': 'Clade_60', 'Clade_34': 'Clade_19', 'Clade_126': 'Clade_68', 'Clade_129': 'Clade_63', 'Clade_115': 'Clade_71', 'Clade_65': 'Clade_70', 'Clade_27': 'Clade_41', 'Clade_86': 'Clade_90', 'Clade_21': 'Clade_93', 'Clade_103': 'Clade_83', 'Clade_134': 'Clade_107', 'Clade_76': 'Clade_55', 'Clade_38': 'Clade_108', 'Clade_30': 'Clade_4', 'Clade_128': 'Clade_66', 'Clade_104': 'Clade_101', 'Clade_100': 'Clade_66', 'Clade_43': 'Clade_105', 'Clade_36': 'Clade_75', 'Clade_84': 'Clade_48', 'Clade_42': 'Clade_31', 'Clade_23': 'Clade_90', 'Clade_13': 'Clade_45', 'Clade_49': 'Clade_5', 'Clade_118': 'Clade_42', 'Clade_32': 'Clade_40', 'Clade_88': 'Clade_86', 'Clade_53': 'Clade_50', 'Clade_70': 'Clade_77', 'Clade_51': 'Clade_69', 'Clade_74': 'Clade_93', 'Clade_31': 'Clade_3', 'Clade_90': 'Clade_65', 'Clade_14': 'Clade_87', 'Clade_73': 'Clade_82', 'Clade_64': 'Clade_61', 'Clade_122': 'Clade_48', 'Clade_52': 'Clade_48', 'Clade_39': 'Clade_30', 'Clade_10': 'Clade_30', 'Clade_1': 'Clade_8', 'Clade_101': 'Clade_67', 'Clade_130': 'Clade_66', 'Clade_99': 'Clade_62', 'Clade_68': 'Clade_93', 'Clade_135': 'Clade_52', 'Clade_33': 'Clade_104', 'Clade_124': 'Clade_63', 'Clade_79': 'Clade_7', 'Clade_5': 'Clade_44', 'Clade_136': 'Clade_30', 'Clade_55':'Clade_47', 'Clade_56':'Clade_69','Clade_57':'Clade_47',"Clade_61":"Clade_58","Clade_62":"Clade_113","Clade_66":"Clade_56","Clade_60":"Clade_69", "Clade_75":"Clade_79","Clade_83":"Clade_72","Clade_85":"Clade_49","Clade_89":"Clade_100","Clade_93":"Clade_34","Clade_97":"Clade_56","Clade_102":"Clade_60","Clade_108":"Clade_12","Clade_109":"Clade_26","Clade_100":"Clade_52","Clade_113":"Clade_47","Clade_114":"Clade_56","Clade_120":"Clade_75","Clade_123":"Clade_59","Clade_131":"Clade_47","Clade_132":"Clade_47","Clade_133":"Clade_47","Clade_137":"Clade_59"}
new_dataset=pd.DataFrame(columns=dataset.columns)
print(dataset.columns)
new_dataset["transator_clade"]= pd.Series(dtype='str')
list_new_dataset=[]
for key in transator_clade_to_transpact_clade.keys():
    for index, row in dataset.iterrows():
        #print(row,type(row))
        #row=pd.DataFrame(row)
        new_row=row.to_dict()
        transpact_clade=row["Clade_desc"]
        #print(transpact_clade)
        if transator_clade_to_transpact_clade[key]==transpact_clade:


            #print(new_row)
            new_row["transator_clade"]=key
            list_new_dataset.append(new_row)
new_dataset=pd.DataFrame(list_new_dataset)

new_dataset.to_csv("/home/friederike/Documents/Kollaborations/Antismash/TransATor/Transator_Table.csv")
