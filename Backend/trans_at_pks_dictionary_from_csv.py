import pandas as pd
import numpy as np

dataset= pd.read_csv("/home/friederike/Documents/Kollaborations/Antismash/TransATor/TransPACT Table.csv")
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

            dictionary_clades_tailorings[row[2]]=row[3]
    except : pass
print(dictionary_clades_tailorings)


leaf_to_clade={'thailandamide_TaiD4_KS4_0redaDMe': 'Clade_33', 'rhizoxins_RhiA1_KS1_0GNATStarter': 'Clade_33', 'bacillaene_Bsub_PksR2_KS15_OshDBaMe': 'Clade_33', 'bacillaene_Bamy_BaeR2_KS14_0shDBMe': 'Clade_33', 'calyculin_CalH1_KS25_bMeDB': 'Clade_33', 'calyculin_CalB4_KS6_0redaLMe': 'Clade_33', 'oocydin_Ddad_OocN6_KS10_0bketo': 'Clade_33', 'oocydin_Smar_OocN6_KS10_0bketo': 'Clade_33', 'rhizopodin_RizC2_KS10_bDOH': 'Clade_73', 'disorazole_DszC1_KS2_0AAoxz': 'Clade_73', 'chivosazole_ChiF4_KS18_0zDB': 'Clade_73', 'tartrolon_TrtD_KS22_red': 'Clade_38', 'tartrolon_TrtF2_KS10_0redaDMe': 'Clade_109', 'nosperin_NspC3_KS6_0biomod_aMeeDB': 'Clade_72', 'bacillaene_Bamy_BaeR1_KS13_0aMeDB': 'Clade_72', 'bacillaene_Bsub_PksR1_KS14_OaMeDB': 'Clade_72', 'calyculin_CalH3_KS27_eDB': 'Clade_72', 'onnamide_OnnI7_KS10_0red': 'Clade_72', 'rhizoxins_RhiD3_KS11_0bimod_aMeeDB': 'Clade_72', 'rhizoxins_RhiE3_KS14_0eDB': 'Clade_61', 'dorrigocin_migrastatin_MgsE2_KS2_0zDB': 'Clade_61', 'cycloheximide_ChxE2_KS2_0zDB': 'Clade_61', '9-methylstreptimidone_SmdI2_KS2_ozDB': 'Clade_61', 'enacyloxin_Bamb_59192_KS11_0eDB': 'Clade_74', 'pederin_PedH4_KS13_0eDB': 'Clade_74', 'mupirocin_MmpE1_KS9_cyclization': 'Clade_74', 'rhizoxins_RhiF2_KS16_0eDB': 'Clade_74', 'tolytoxin_TtoF5_KS19_0eDB': 'Clade_74', 'luminaolid_LumE4_KS18_0bDOH': 'Clade_74', 'misakinolide_MisF5_KS19_0eDB': 'Clade_74', 'elansolid_Csan_ElaR1_KS14_0eDB': 'Clade_74', 'elansolid_ElsQ1_KS14_0eDB': 'Clade_74', 'sorangicin_SorI2_KS24_0zDB': 'Clade_55', 'bongkrekic_acid_BonD3_KS12_0vinylbranch': 'Clade_55', 'sorangicin_SorB1_KS8_0zDB': 'Clade_55', 'phormidolide_phmI_5_KS_17_0bMeeDB': 'Clade_86', 'oocydin_Ddad_OocS4_KS16_0': 'Clade_86', 'oocydin_Smar_OocS4_KS16_0': 'Clade_86', 'thailanstatin_TstC3_KS3_0eDB': 'Clade_86', 'FR901464_Fr9C3_KS3_0eDB': 'Clade_86', 'calyculin_CalC1_KS7_KS0oxa': 'Clade_75', 'rhizoxins_RhiB1_KS2_0AAoxa': 'Clade_75', 'chivosazole_ChiD1_KS10_0AAoxz': 'Clade_75', 'rhizopodin_RizD1_KS11_0AAoxa': 'Clade_75', 'disorazole_DszC1_KS9_0AAoxz': 'Clade_75', 'virginiamycin_VirH1_KS7_0AAoxz': 'Clade_75', 'griseoviridin_SgvE41_KS7_bDOH': 'Clade_75', 'leinamycin_LnmI1_KS1_0AAoxz': 'Clade_75', 'FR901464_Fr9I2_KS12_0pyran': 'Clade_108', 'thailanstatin_TstI2_KS12_0pyran': 'Clade_108', 'disorazole_DszB4_KS8_0zDB': 'Clade_110', 'oocydin_Ddad_OocS3_KS15_0bLOH': 'Clade_79', 'oocydin_Smar_OocS3_KS15_0bLOH': 'Clade_79', 'elansolid_Cpin_ElsO2_KS9_0bimod_bOH': 'Clade_79', 'elansolid_Csan_ElaP2_KS9_0bimod_bOH': 'Clade_79', 'bacillaene_Bsub_PksM3_KS10_bOH': 'Clade_79', 'etnangien_EtnG2_KS12_0bLOH': 'Clade_79', 'etnangien_EtnI4_KS20_0bLOH': 'Clade_79', 'etnangien_EtnF3_KS10_bLOH': 'Clade_79', 'oxazolomycin_OzmH4_KS8_0eDB': 'Clade_3', 'difficidin_DifG2_KS5_0Hbimod_bOH': 'Clade_3', 'misakinolide_MisE4_KS14_0bLOH': 'Clade_3', 'tolytoxin_TtoE8_KS14_0bimod_bDOH': 'Clade_3', 'luminaolid_LumD4_KS14_0bimod_bDOH': 'Clade_3', 'thailandamide_TaiK2_KS8_0bOH': 'Clade_3', 'kalimantacin_batuminBat26_KS7_0bimod_bOH': 'Clade_3', 'sorangicin_SorH3_KS22_0bimod_bOH': 'Clade_3', 'bongkrekic_acid_BonA6_KS6_0bimod_bOH': 'Clade_3', 'sorangicin_SorA7_KS7_0bimod_bOH': 'Clade_3', 'bacillaene_Bsub_PksL4_KS7_Obimod_bOH': 'Clade_3', 'bacillaene_Bamy_BaeL4_KS7_0Hbimod_bOH': 'Clade_3', 'bacillaene_Bsub_PksJ3_KS3_OHbimod_OH': 'Clade_3', 'bacillaene_Bamy_BaeJ3_KS3_0Hbimod_bOH': 'Clade_3', 'difficidin_DifJ2_KS12_obimod_bOH': 'Clade_3', 'leinamycin_LnmI3_KS3_zDB': 'Clade_4', 'tartrolon_TrtD_KS33_bimod_bOH': 'Clade_4', 'kirromycin_KirAI2_KS2_zcrotonyl': 'Clade_4', 'kirromycin_KirAIV5_KS11_bDOH': 'Clade_4', 'etnangien_EtnG4_KS14_0bOH': 'Clade_4', 'difficidin_DifI4_KS10_bimod_bOH': 'Clade_4', 'elansolid_Csan_ElaO2_KS7_bimod_bDOH': 'Clade_4', 'elansolid_Cpin_ElsN2_KS7_bimod_bDOH': 'Clade_4', 'basiliskamides_P615_BasE3_KS3_bOH': 'Clade_4', 'macrolactin_MlnE2_KS8_bimod_bOH': 'Clade_4', 'macrolactin_MlnG1_KS11_bimod_bOH': 'Clade_4', 'chivosazole_ChiD3_KS12_bimod_bOH': 'Clade_4', 'chivosazole_ChiF2_KS16_bimod_bOH': 'Clade_4', 'chivosazole_ChiC2_KS5_bimod_bOH': 'Clade_4', 'rhizopodin_RizE3_KS19_0bLOH': 'Clade_34', 'oocydin_Ddad_OocR1_KS11_obimod_bOH': 'Clade_34', 'oocydin_Smar_OocR1_KS11_0bimod_bOH': 'Clade_34', 'myxovirescin_Ta13_KS3_0bLOH': 'Clade_34', 'diaphorin_DipT1_KS4_0acetal': 'Clade_34', 'pederin_PedF1_KS4_0hacetal': 'Clade_34', 'onnamide_OnnI1_KS4_0hacetale': 'Clade_34', 'nosperin_NspC1_KS4_0hacetal': 'Clade_34', 'psymberin_PsyD1_KS3_bimod_0bLOH': 'Clade_34', 'calyculin_CalB1_KS3_KS0_bLOH': 'Clade_34', 'phormidolide_phmH_1_KS9_0aMebOH': 'Clade_34', 'oocydin_Ddad_OocN1_KS5_0aDOHbLOH': 'Clade_34', 'oocydin_Smar_OocN1_KS5_0aDOHbLOH': 'Clade_34', 'calyculin_CalF1_KS16_0_bLOH_aLMebLOH': 'Clade_34', 'thiomarinol_TmpA1_KS5_0bDOH': 'Clade_34', 'mupirocin_MmpA1_KS5_0bDOH': 'Clade_34', 'tartrolon_TrtE2_KS5_0red': 'Clade_36', 'thailanstatin_TstI1_KS11_0bDOH': 'Clade_36', 'FR901464_Fr9I1_KS11_0bDOH': 'Clade_36', 'misakinolide_MisC3_KS3_0bimod_bDOMe': 'Clade_49', 'luminaolid_LumA3_KS3_0bimod_aDMebDOH': 'Clade_49', 'tolytoxin_TtoC3_KS3_0aDMebDOH': 'Clade_49', 'rhizopodin_RizE1_KS17_obimod_bLOH': 'Clade_49', 'rhizopodin_RizB3_KS3_0bimod_aDMebDOH': 'Clade_49', 'rhizopodin_RizD3_KS13_0bimod_bDOH': 'Clade_49', 'rhizopodin_RizB7_KS7_0bimodbDOH': 'Clade_49', 'chivosazole_ChiC6_KS9_0aDMebDOH': 'Clade_49', 'bryostatin_BryD2_KS13_0bDOH': 'Clade_60', 'FR901464_Fr9C2_KS2_0bOH': 'Clade_60', 'thailanstatin_TstC2_KS2_0bOH': 'Clade_60', 'nosperin_NspC5_KS5_aMebOH': 'Clade_60', 'bryostatin_BryC4_KS11_0bDOH': 'Clade_60', 'luminaolid_LumD1_KS11_0bimod_bDOH': 'Clade_60', 'misakinolide_MisE1_KS11_0bDOH': 'Clade_60', 'tolytoxin_TtoE5_KS11_0bDOH': 'Clade_60', 'calyculin_CalE5_KS14_0bLOH': 'Clade_60', 'calyculin_CalF3_KS18_0bDOH': 'Clade_60', 'thailandamide_TaiN1_KS16_0aDMebDOH': 'Clade_60', 'oxazolomycin_OzmJ2_KS11_0aLOMebketo': 'Clade_60', 'oxazolomycin_OzmH2_KS6_AAgly': 'Clade_30', 'rhizopodin_RizB1_KS1_AAgly': 'Clade_30', 'tolytoxin_TtoC1_KS1_AAgly': 'Clade_30', 'luminaolid_LumA1_KS1_AAgly': 'Clade_30', 'myxopyronin_MxnI2_KS2_AAgly': 'Clade_30', 'corallopyronin_CorI2_KS2_AAGly': 'Clade_30', 'kalimantacin_batumin_Bat21_KS2_AAGly': 'Clade_1', 'FR901464_Fr9D1_KS4_AAthr': 'Clade_1', 'thailanstatin_TstDEF1_KS4_AAthr': 'Clade_1', 'psymberin_PsyD2_KS4_AAgly': 'Clade_1', 'myxovirescin_Ta11_KS1_AAgly': 'Clade_1', 'thailandamide_TaiE1_KS5_AAala': 'Clade_1', 'calyculin_CalB2_KS4_AAgly': 'Clade_1', 'calyculin_CalH2_KS26_AAala': 'Clade_1', 'bacillaene_Bsub_PksN1_KS11_AAala': 'Clade_1', 'bacillaene_Bamy_BaeN1_KS10_AAala': 'Clade_1', 'bacillaene_Bamy_BaeJ1_KS1_Agly': 'Clade_1', 'bacillaene_Bsub_PksJ1_KS1_AAgly': 'Clade_1', 'calyculin_CalA_KS1_KS0AAser': 'Clade_1', 'pederin_PedF2_KS5_AAgly': 'Clade_1', 'diaphorin_DipT2_KS5_AAgly': 'Clade_1', 'nosperin_NspC2_KS5_AAgly': 'Clade_1', 'onnamide_OnnI2_KS5_AAgly': 'Clade_1', 'griseoviridin_SgvE21_KS3_AAgly': 'Clade_2', 'virginiamycin_VirA3_KS3_AAgly': 'Clade_2', 'oxazolomycin_OzmQ1_KS1_AAgly': 'Clade_2', 'oxazolomycin_OzmN1_KS2_AAoxa': 'Clade_2', 'malleilactone_burkholderic_acid_BurA1_KS1_unusualStarter': 'Clade_2', 'kirromycin_KirAIII4_KS6_AAgly': 'Clade_121', 'misakinolide_MisC1_KS1_acetylStarter': 'Clade_41', 'myxopyronin_MxnK1_KS7_starter': 'Clade_41', 'corallopyronin_CorK1_KS7_acetyl': 'Clade_41', 'macrolactin_MlnB1_KS1_acetylStarter': 'Clade_41', 'chlorotonil_CtoC1_KS1_acetylStarter': 'Clade_41', 'anthracimycin_AtcD1_KS1_acetylStarter': 'Clade_41', 'disorazole_DszA1_KS1_acetylStarter': 'Clade_41', 'kalimantacin_batumin_Bat11_KS1_AcStarter': 'Clade_8', 'onnamide_OnnB1_KS1_GNATstarter': 'Clade_8', 'nosperin_NspA1_KS1_GNATstarter': 'Clade_8', 'pederin_PedI1_KS1_GNATStarter': 'Clade_8', 'diaphorin_DipP1_KS1_GNATstarter': 'Clade_8', 'psymberin_PsyA1_KS1_GNATStarter': 'Clade_8', 'basiliskamides_P615_14890_KS5_eDB': 'Clade_8', 'bryostatin_BryX1_KS14_GNATstarter': 'Clade_8', 'calyculin_CalE2_KS11_aketo': 'Clade_8', 'albicidin_AlbI1_KS1_aromaticStarter_AL': 'Clade_10', 'elansolid_Cpin_ElsI1_KS1_aromaticstarter': 'Clade_10', 'elansolid_Csan_ElaJ1_KS1_aromaticstarter': 'Clade_10', 'legioliulin_LglD1_KS1_aromaticStarter': 'Clade_125', 'calyculin_CalE1_KS10_KS0ox': 'Clade_126', 'etnangien_EtnI1_KS17_redaLMe': 'Clade_103', 'chivosazole_ChiE2_KS14_aLMebLOH': 'Clade_99', 'bongkrekic_acid_BonA3_KS3_aMeDB': 'Clade_93', 'bongkrekic_acid_BonD1_KS10_aLMe': 'Clade_93', 'FR901464_Fr9F2_KS5_redaLMe': 'Clade_93', 'thailanstatin_TstDEF2_KS5_redaLMe': 'Clade_93', 'sorangicin_SorA3_KS3_redaDMe': 'Clade_93', 'sorangicin_SorD1_KS13_aLOHbLOH': 'Clade_93', 'sorangicin_SorG1_KS18_aLMbLOH': 'Clade_93', 'myxovirescin_TaP1_KS1_redaDMe': 'Clade_93', 'basiliskamides_P615_BasE1_KS2_aLMe_red': 'Clade_93', 'basiliskamides_P615_BasF1_KS1_GNATstarter': 'Clade_93', 'calyculin_CalE6_KS16_adiMbketo': 'Clade_93', 'calyculin_CalB3_KS5_0redaLMe': 'Clade_93', 'sorangicin_SorE1_KS15_aDMbLOH': 'Clade_93', 'bryostatin_BryC3_KS10_adiMebketo': 'Clade_93', 'bryostatin_BryB2_KS5_adiMEbketo': 'Clade_93', 'thiomarinol_TmpD2_KS2_aLMebLOH': 'Clade_93', 'mupirocin_MmpD2_KS2_aLMebLOH': 'Clade_93', 'difficidin_DifL1_KS14_redaMe': 'Clade_93', 'elansolid_Csan_ElaK1_KS3_adiMebDOH': 'Clade_93', 'elansolid_Cpin_ElsJ1_KS3_adiMebDOH': 'Clade_93', 'elansolid_Csan_ElaK2_KS4_aMe': 'Clade_93', 'elansolid_Cpin_ElsJ2_KS4_aMe': 'Clade_93', 'dorrigocin_migrastatin_MgsF_4KS7_aDMebLOH': 'Clade_93', 'thiomarinol_TmpD4_KS4_aDOH': 'Clade_93', 'mupirocin_MmpD4_KS4_aDMe': 'Clade_93', 'dorrigocin_migrastatin_MgsF5_KS8_bLOH': 'Clade_93', 'dorrigocin_migrastatin_MgsF2_KS5_aDMebketodH': 'Clade_93', 'cycloheximide_ChxE5_KS5_aDMebketo': 'Clade_93', '9-methylstreptimidone_SmdI_KS55_aDMebketo': 'Clade_93', 'etnangien_EtnF1_KS8_aDMebDOH': 'Clade_93', 'misakinolide_MisD1_KS6_redaLMe': 'Clade_90', 'luminaolid_LumB3_KS6_redaLMe': 'Clade_90', 'tolytoxin_TtoD3_KS6_redaLMe': 'Clade_90', 'rhizopodin_RizC1_KS9_adiMebLOH': 'Clade_90', 'rhizopodin_RizB6_KS6_redaLMe': 'Clade_90', 'chlorotonil_CtoD3_KS7_redaMe': 'Clade_90', 'anthracimycin_AtcF1_KS8_shDB': 'Clade_90', 'anthracimycin_AtcD4_KS4_aMezshDB': 'Clade_90', 'chivosazole_ChiB3_KS3_aLMebLOH': 'Clade_90', 'calyculin_CalG2_KS22_aMeDB': 'Clade_47', 'sorangicin_SorA4_KS4_aMeeDB': 'Clade_47', 'sorangicin_SorC1_KS12_eDB': 'Clade_47', 'thailandamide_TaiM3_KS15_aMeeDB': 'Clade_47', 'malleilactone_burkholderic_acid_BurF2_KS2_aMeeDB': 'Clade_47', 'rhizoxins_RhiC1_KS6_aMeeDB': 'Clade_47', 'albicidin_AlbI2_KS2_aMeeDB': 'Clade_47', 'FR901464_Fr9F4_KS7_aMeeDB': 'Clade_47', 'thailanstatin_TstDEF4_KS7_aMeeDB': 'Clade_47', 'difficidin_DifI1_KS7_aMezDB': 'Clade_47', 'elansolid_Csan_ElaQ3_KS13_aMeDB': 'Clade_47', 'elansolid_Cpin_ElsP3_KS13_aMeDB': 'Clade_47', 'elansolid_Cpin_ElsI2_KS2_eDB': 'Clade_47', 'elansolid_Csan_ElaJ2_KS2_eDB': 'Clade_47', 'bacillaene_Bsub_PksM2_KS9_zDBaMe': 'Clade_47', 'bacillaene_Bamy_BaeM2_KS9_zDBaMe': 'Clade_47', 'rhizoxins_RhiB3_KS4_aMeeDB': 'Clade_47', 'tolytoxin_TtoF4_KS18_aMeeDB': 'Clade_47', 'misakinolide_MisF4_KS18_aMeeDB': 'Clade_47', 'difficidin_DifF2_KS2_aMeeDB': 'Clade_47', 'chivosazole_ChiC4_KS7_eDB': 'Clade_48', 'oxazolomycin_OzmH1_KS5_aMezDB': 'Clade_48', 'myxopyronin_MxnJ2_KS5_0redaLMe': 'Clade_48', 'corallopyronin_CorJ2_KS5_0aMe': 'Clade_48', 'chivosazole_ChiF1_KS15_aMeeDB': 'Clade_48', 'lankacidin_LkcC1_KS2_aMeeDB': 'Clade_48', 'leinamycin_LnmJ3_KS6_aMeDB': 'Clade_48', 'myxopyronin_MxnK5_KS11_aMeDB': 'Clade_48', 'corallopyronin_CorL4_KS13_aMeDB': 'Clade_48', 'kirromycin_KirAIV3_KS9_aMebketo': 'Clade_22', 'kirromycin_KirAII2_KS4_diMbLOH': 'Clade_22', 'kirromycin_KirAII3_KS5_bDOH': 'Clade_22', 'chlorotonil_CtoC4_KS4_aMezshDB': 'Clade_84', 'chlorotonil_CtoD4_aMeshDB': 'Clade_84', 'onnamide_OnnB2_KS2_aLMeDOH': 'Clade_58', 'nosperin_NspA2_KS2_aLMebDOH': 'Clade_58', 'diaphorin_DipP2_KS2_aLMebDOH': 'Clade_58', 'pederin_PedI2_KS2_aLMebDOH': 'Clade_58', 'luminaolid_LumC1_KS7_aLMebLOMe_aLMebLOH': 'Clade_100', 'misakinolide_MisD2_KS9_lH': 'Clade_100', 'tolytoxin_TtoE1_KS7_aDMebDOH': 'Clade_100', 'psymberin_PsyD4_KS6_adiMebDOH': 'Clade_80', 'phormidolide_phmF_3_KS6_adiMebOH': 'Clade_80', 'rhizoxins_RhiD1_K9_aMebDOH': 'Clade_80', 'rhizoxins_RhiC2_KS7_aDMebLOH': 'Clade_80', 'calyculin_CalF5_KS20_aLMebLOH': 'Clade_80', 'calyculin_CalG1_KS21_aLMebLOH': 'Clade_80', 'tolytoxin_TtoE4_KS10_aLMebLOH': 'Clade_80', 'luminaolid_LumC4_KS10_aLMebLOH': 'Clade_80', 'misakinolide_MisD4_KS10_aLMebLOH': 'Clade_80', 'calyculin_CalE4_KS13_bLOH': 'Clade_80', 'oxazolomycin_OzmJ1_KS10_aLMebLOH': 'Clade_80', 'psymberin_PsyD6_KS8_aDMebLOH': 'Clade_80', 'pederin_PedF4_KS7_adiMebDOH': 'Clade_80', 'diaphorin_DipT4_KS7_adiMebOH': 'Clade_80', 'onnamide_OnnI4_KS7_adiMebDOH': 'Clade_80', 'oocydin_Ddad_OocS1_KS13_aMebOH': 'Clade_80', 'oocydin_Smar_OocS1_KS13_aMebOH': 'Clade_80', 'luminaolid_LumC2_KS8_aDMebDOH_bDOH': 'Clade_85', 'misakinolide_MisD2_KS8_bLOH': 'Clade_85', 'tolytoxin_TtoE2_KS8_aDMeDOH': 'Clade_85', 'disorazole_DszA3_KS3_adiMebLOH': 'Clade_85', 'chivosazole_ChiC1_KS4_aDMebDOH': 'Clade_85', 'phormidolide_phmF_1_KS4_aMebOH': 'Clade_113', 'etnangien_EtnD3_KS3_bDOH': 'Clade_113', 'etnangien_EtnI3_KS19_aLMebDOH': 'Clade_113', 'etnangien_EtnI2_KS18_aLMebDOH': 'Clade_113', 'etnangien_EtnF2_KS9_bDOH': 'Clade_113', 'kalimantacin_batumin_Bat23_KS4_bOH': 'Clade_113', 'elansolid_Cpin_ElsP1_KS11_aLMebDOH': 'Clade_113', 'elansolid_Csan_ElaQ1_KS11_aLMebDOH': 'Clade_113', 'difficidin_DifG1_KS4_OH': 'Clade_113', 'basiliskamides_P615_BasE2_KS3_aDMebDOH': 'Clade_113', 'phormidolide_phmH_2_KS10_aMebOH': 'Clade_77', 'oocydin_Ddad_OocN2_KS6_aDOHbLOH': 'Clade_77', 'oocydin_Smar_OocN2_KS6_aDOHbLOH': 'Clade_77', 'myxovirescin_Ta14_KS4_bLOH': 'Clade_53', 'thiomarinol_TmpA2_KS6_aDOHbDOH': 'Clade_53', 'mupirocin_MmpA2_KS6_aDOHbDOH': 'Clade_53', 'calyculin_CalF2_KS17_aDOHbDOH': 'Clade_53', 'rhizoxins_RhiF1_KS15_vinylogous': 'Clade_39', 'dorrigocin_migrastatin_MgsE3_KS3_vinylogous': 'Clade_39', 'cycloheximide_ChxE3_KS3_vinylogous': 'Clade_39', '9-methylstreptimidone_SmdI3_KS3_vinylogous': 'Clade_39', 'tartrolon_TrtE1_KS4_eDB': 'Clade_42', 'difficidin_DifF1_KS1_unusualStarters_acryloyl': 'Clade_42', 'disorazole_DszA2_KS2_eDB': 'Clade_42', 'myxopyronin_MxnK2_KS8_0red': 'Clade_42', 'corallopyronin_CorK2_KS8_eDB': 'Clade_42', 'difficidin_DifJ1_KS11_zDB_zDB': 'Clade_65', 'elansolid_Cpin_ElsO1_KS8_eDB': 'Clade_65', 'elansolid_Csan_ElaP1_KS8_eDB': 'Clade_65', 'macrolactin_MlnG1_KS10_dH': 'Clade_65', 'macrolactin_MlnE1_KS7_bDOH': 'Clade_65', 'macrolactin_MlnD1_KS5_eDB': 'Clade_65', 'luminaolid_LumB2_KS5_bketo': 'Clade_65', 'tolytoxin_TtoD2_KS5_bketo': 'Clade_65', 'macrolactin_MlnC1_KS4_eDB': 'Clade_65', 'macrolactin_MlnF1_KS9_zD_zDB': 'Clade_65', 'legioliulin_LglD2_KS2_eDB': 'Clade_68', 'chivosazole_ChiE1_KS13_zDB_eDB': 'Clade_68', 'chlorotonil_CtoE1_KS9_DB_DA': 'Clade_68', 'virginiamycin_VirA4_KS4_eDB': 'Clade_66', 'griseoviridin_SgvE22_KS4__eDB': 'Clade_66', 'anthracimycin_AtcE_KS5_eDB': 'Clade_66', 'oxazolomycin_OzmN2_KS3_eDB': 'Clade_66', 'kirromycin_KirAIV2_KS8_aMeeDB': 'Clade_66', 'kirromycin_KirAIV1_KS7_eDB': 'Clade_66', 'anthracimycin_AtcE_KS6_eDB': 'Clade_66', 'oxazolomycin_OzmH3_KS7_eDB': 'Clade_66', 'lankacidin_LkcF1_KS3_bDOH': 'Clade_66', 'anthracimycin_AtcF2_KS9_eDB_DA': 'Clade_66', 'leinamycin_LnmJ1_KS4_eDB': 'Clade_66', 'kirromycin_KirAV1_KS12_eDB': 'Clade_66', 'kirromycin_KirAII1_KS3_eDB': 'Clade_66', 'chlorotonil_CtoD2_KS6_eDB': 'Clade_66', 'disorazole_DszB3_KS7_eDB': 'Clade_66', 'chlorotonil_CtoD1_KS5_eDB': 'Clade_66', 'chivosazole_ChiF3_KS17_eDB_zDB': 'Clade_66', 'chivosazole_ChiC3_KS6_eDB_zDB': 'Clade_66', 'leinamycin_LnmI2_KS2_AAoxz': 'Clade_66', 'anthracimycin_AtcD3_KS3_eDB': 'Clade_107', 'chlorotonil_CtoC3_KS3_eDB': 'Clade_107', 'corallopyronin_CorI3_KS3_0bimod_eDB': 'Clade_31', 'myxopyronin_MxnI3_KS3_biMod_eDB': 'Clade_31', 'rhizopodin_RizB2_KS2_eDB': 'Clade_31', 'rhizoxins_RhiB4_KS5_eDB': 'Clade_62', 'bryostatin_BryB3_KS6_eDB': 'Clade_62', 'bryostatin_BryX2_KS15_0': 'Clade_62', 'calyculin_CalC3_KS9_eDB': 'Clade_62', 'calyculin_CalG4_KS24_eDB': 'Clade_62', 'onnamide_OnnJ2_KS12_bimod_eDB': 'Clade_62', 'phormidolide_phmI_4_KS16_eDB': 'Clade_62', 'pederin_PedH3_KS12_bimod_bOH': 'Clade_62', 'FR901464_Fr9GH1_KS8_eDB': 'Clade_62', 'thailanstatin_TstGH1_KS8_eDB': 'Clade_62', 'difficidin_DifK1_KS13_eDB': 'Clade_62', 'thailandamide_TaiE2_KS6_eDB': 'Clade_57', 'bongkrekic_acid_BonD2_KS11_eDB': 'Clade_57', 'bongkrekic_acid_BonA5_KS5_DB': 'Clade_57', 'bongkrekic_acid_BonB1_KS7_DB': 'Clade_57', 'bongkrekic_acid_BonC1_KS9_eDB': 'Clade_57', 'sorangicin_SorH2_KS21_eDB': 'Clade_64', 'sorangicin_SorB3_KS10_eDB': 'Clade_64', 'sorangicin_SorE3_KS17_eDB': 'Clade_64', 'kalimantacin_batumin_Bat25_KS6_eD': 'Clade_64', 'etnangien_EtnE2_KS6_eDB': 'Clade_64', 'etnangien_EtnE1_KS5_eDB': 'Clade_64', 'etnangien_EtnH2_KS16_eDB': 'Clade_64', 'sorangicin_SorI1_KS23_zDB': 'Clade_64', 'etnangien_EtnD4_KS4_eDB': 'Clade_64', 'SIA7248_SiaG3_KS10_eDB': 'Clade_64', 'bacillaene_Bamy_BaeL2_KS5_eD': 'Clade_64', 'bacillaene_Bsub_PksL2_KS5_eD': 'Clade_64', 'myxovirescin_Ta17_KS7_eDB': 'Clade_64', 'thailandamide_TaiL4_KS12_eDB': 'Clade_64', 'SIA7248_SiaH_KS11_eDB': 'Clade_70', 'rhizopodin_RizD6_KS16_eDB': 'Clade_70', 'thailandamide_TaiD3_KS3_eDB': 'Clade_63', 'SIA7248_SiaF2_KS5_bDOH': 'Clade_57', 'thiomarinol_TmpD3_KS3_eDB': 'Clade_63', 'mupirocin_MmpD3_KS3_eDB': 'Clade_63', 'thailandamide_TaiM2_KS14_eDB': 'Clade_63', 'dorrigocin_migrastatin_MgsF3_KS6_aMeeDB': 'Clade_63', 'thiomarinol_TmpB1_KS8_eDBbMe': 'Clade_63', 'mupirocin_MmpB1_KS8_esterification': 'Clade_63', 'mupirocin_MmpA3_KS7_bDOH': 'Clade_63', 'thiomarinol_TmpA3_KS7_bOH': 'Clade_63', 'elansolid_Cpin_ElsJ3_KS5_eDB': 'Clade_63', 'elansolid_Csan_ElaK3_KS5_eDB': 'Clade_63', 'elansolid_Cpin_ElsO3_KS10_zDB': 'Clade_63', 'elansolid_Csan_ElaP3_KS10_zDB': 'Clade_63', 'thailandamide_TaiL2_KS10_bketo': 'Clade_71', 'psymberin_PsyD8_KS10_aMebketo': 'Clade_71', 'legioliulin_LglD4_KS4_bketo': 'Clade_71', 'SIA7248_SiaH_KS12_bketo': 'Clade_71', 'leinamycin_LnmJ2_KS5_bketo': 'Clade_89', 'anthracimycin_AtcE_KS7_redaMe': 'Clade_89', 'lankacidin_LkcG1_KS5_aMebketo': 'Clade_89', 'tartrolon_TrtE5_KS8_bketo': 'Clade_127', 'SIA7248_SiaD1_KS1_unusualStarter_lactate': 'Clade_45', 'tartrolon_TrtD1_KS1_unusualStarter_lactate': 'Clade_45', 'bryostatin_BryA1_KS1_lactateStarter': 'Clade_45', 'FR901464_Fr9C1_KS1_unusualstarter_lactate': 'Clade_45', 'thailanstatin_TstC1_KS1_lactateStarter': 'Clade_45', 'myxopyronin_MxnI1_KS1_unusualstarter': 'Clade_19', 'corallopyronin_CorI1_KS1_unusualStarter_methoxycarbonyl': 'Clade_19', 'rhizopodin_RizB5_KS5_bketo': 'Clade_67', 'SIA7248_SiaG2_KS9_eDB': 'Clade_67', 'rhizopodin_RizD5_KS15_bimod_bOH': 'Clade_67', 'bryostatin_BryX3_KS16': 'Clade_114', 'lankacidin_LkcF2_KS4_aDMebLOH': 'Clade_120', 'lankacidin_LkcA1_KS1_AAgly': 'Clade_120', 'bongkrekic_acid_BonA_KS11_GNATstarter': 'Clade_40', 'enacyloxin_Bamb_59202_KS9_aMeDB': 'Clade_40', '2qo3_chainA_EryKS3_OUTGROUP': 'Clade_40', '2hg4_chainA_EryKS5_OUTGROUP': 'Clade_40', 'SIA7248_SiaI1_KS13_2biMod_OH': 'Clade_40', 'psymberin_PsyD9_KS11_bketo': 'Clade_40', 'rhizoxins_RhiB2_KS3_AAoxa': 'Clade_44', 'calyculin_CalC2_KS8_AAoxa': 'Clade_44', 'chivosazole_ChiD2_KS11_AAoxz': 'Clade_44', 'rhizopodin_RizD2_KS12_AAoxa': 'Clade_44', 'oocydin_Ddad_OocL1_KS3_rearrangement': 'Clade_11', 'oocydin_Smar_OocL1_KS3_rearrangement': 'Clade_11', 'pederin_PedH1_KS10_rearrangement': 'Clade_11', 'diaphorin_DipO1_KS10_rearrangement': 'Clade_11', 'misakinolide_MisC5_KS5_LOH_or_DPY': 'Clade_123', 'onnamide_OnnI5_KS8_pyran': 'Clade_23', 'diaphorin_DipT5_KS8_pyran': 'Clade_23', 'pederin_PedF5_KS8_pyran': 'Clade_23', 'misakinolide_MisF2_KS16_pyran': 'Clade_23', 'tolytoxin_TtoF2_KS16_pyran': 'Clade_23', 'luminaolid_LumE2_KS16_pyran': 'Clade_23', 'thailanstatin_TstDEF3_KS6_pyran': 'Clade_23', 'FR901464_Fr9F3_KS6_pyran': 'Clade_23', 'phormidolide_phmH_4_KS12_furan': 'Clade_23', 'sorangicin_SorB2_KS9_pyran': 'Clade_23', 'sorangicin_SorE2_KS16_pyran': 'Clade_23', 'sorangicin_SorH1_KS20_pyrane': 'Clade_23', 'bryostatin_BryC2_KS9_pyran': 'Clade_23', 'oocydin_Smar_OocN4_KS8_furan': 'Clade_23', 'oocydin_Ddad_OocN4_KS8_furan': 'Clade_23', 'psymberin_PsyD5_KS7_pyran': 'Clade_23', 'tartrolon_TrtF3_KS11_redaDMe': 'Clade_38', 'tartrolon_TrtE4_KS7_bLOH': 'Clade_38', 'macrolactin_MlnB3_KS3_red': 'Clade_26', 'corallopyronin_CorK3_KS9_red': 'Clade_26', 'myxopyronin_MxnK3_KS9_red': 'Clade_26', 'corallopyronin_CorL2_KS11_red': 'Clade_26', 'sorangicin_SorB4_KS11_red': 'Clade_12', 'sorangicin_SorA2_KS2_red': 'Clade_12', 'bacillaene_Bamy_BaeJ2_KS2_red': 'Clade_12', 'bacillaene_Bsub_PksJ2_KS2_red': 'Clade_12', 'difficidin_DifF3_KS3_red': 'Clade_12', 'difficidin_DifI3_KS9_red': 'Clade_12', 'bacillaene_Bamy_BaeN2_KS11_shDB': 'Clade_12', 'bacillaene_Bsub_PksN2_KS12_shDB': 'Clade_12', 'bacillaene_Bsub_PksN3_KS13_shDB': 'Clade_12', 'bacillaene_Bamy_BaeN3_KS12_shDB': 'Clade_12', 'calyculin_CalE3_KS12_aDMebLOH': 'Clade_12', 'pederin_PedH2_KS11_red': 'Clade_12', 'diaphorin_DipO2_KS11_DB': 'Clade_12', 'calyculin_CalA2_KS2_AAser': 'Clade_12', 'phormidolide_phmE_3_KS3_bOH': 'Clade_12', 'oocydin_Smar_OocR2_KS12_shDB': 'Clade_12', 'oocydin_Ddad_OocR2_KS12_shDB': 'Clade_12', 'oocydin_Smar_OocN5_KS9_red': 'Clade_12', 'oocydin_Ddad_OocN5_KS9_red': 'Clade_12', 'dorrigocin_migrastatin_MgsF6_KS9_eDB': 'Clade_12', 'dorrigocin_migrastatin_MgsG1_KS10_red': 'Clade_12', 'myxovirescin_Ta15_KS5_red': 'Clade_12', 'myxovirescin_TaO3_KS10_bketo': 'Clade_12', 'rhizoxins_RhiD2_KS10_shD': 'Clade_12', 'myxovirescin_TaO4_KS11_red': 'Clade_12', 'kalimantacin_batumin_Bat32_KS9_eDB': 'Clade_12', 'bongkrekic_acid_BonB2_KS8_red': 'Clade_12', 'myxovirescin_TaO2_KS9_red': 'Clade_12', 'thiomarinol_TmpB2_KS9_0rearrangement': 'Clade_12', 'etnangien_EtnG1_KS11_red': 'Clade_12', 'myxopyronin_MxnJ3_KS6_redaLMe': 'Clade_105', 'corallopyronin_CorJ3_KS6_aDMe': 'Clade_105', 'luminaolid_LumA2_KS2_aDMeshDB': 'Clade_105', 'tolytoxin_TtoC2_KS2_aDMeshDB': 'Clade_105', 'leinamycin_LnmJ4_KS7_red': 'Clade_105', 'tartrolon_TrtE3_KS6_red': 'Clade_5', 'rhizoxins_RhiE1_KS1_aMeshDB': 'Clade_5', 'nosperin_NspC4_KS7_aMeshDB': 'Clade_5', 'onnamide_OnnJ1_KS11_bOH': 'Clade_5', 'calyculin_CalI1_KS24_shDB': 'Clade_5', 'corallopyronin_CorJ1_KS4_shDB': 'Clade_106', 'myxopyronin_MxnJ1_KS4_shDB': 'Clade_106', 'etnangien_EtnD1_KS1_unusualStarters_Succ': 'Clade_6', 'sorangicin_SorA1_KS1_unusualStarter': 'Clade_6', 'dorrigocin_migrastatin_MgsE1_KS1_unusualStarter_AMT': 'Clade_6', '9-methylstreptimidone_SmdI1_KS1_unusualstarter_AMT': 'Clade_6', 'cycloheximide_ChxE1_KS1_unusualStarter_AMT': 'Clade_6', 'griseoviridin_SgvE11_KS1_acetylStarter': 'Clade_7', 'virginiamycin_VirA1_KS1_unusualstarter': 'Clade_7', 'kirromycin_KirAI1_KS1_AcStarter': 'Clade_7', 'thailandamide_TaiD1_KS1_aromaticStarter': 'Clade_104', 'thiomarinol_TmpD1_KS1_acetylStarter': 'Clade_104', 'mupirocin_MmpD1_KS1_acetylStarter': 'Clade_104', 'phormidolide_phmE_1_KS1_phosphoglycerate': 'Clade_92', 'oocydin_Ddad_OocJ1_KS1_unusualStarter': 'Clade_92', 'oocydin_Smar_OocJ1_KS1_unusualStarter': 'Clade_92', 'etnangien_EtnH1_KS15_bimod_zDB': 'Clade_119', 'disorazole_DszB2_KS6_zDB': 'Clade_43', 'disorazole_DszB1_KS5_zDB': 'Clade_43', 'oxazolomycin_OzmN3_KS4_zDB': 'Clade_43', 'oocydin_Smar_OocS2_KS14_aMezDB': 'Clade_69', 'oocydin_Ddad_OocS2_KS14_aMezDB': 'Clade_69', 'tolytoxin_TtoF1_KS15_zDB': 'Clade_69', 'luminaolid_LumE1_KS15_zDB': 'Clade_69', 'misakinolide_MisF1_KS15_zDB': 'Clade_69', 'bacillaene_Bamy_BaeM1_KS8_zDB': 'Clade_69', 'bacillaene_Bsub_PksM1_KS8_zDB': 'Clade_69', 'bacillaene_Bamy_BaeL1_KS4_zD': 'Clade_69', 'bacillaene_Bsub_PksL1_KS4_zD': 'Clade_69', 'difficidin_DifH1_KS6_zDB': 'Clade_69', 'oxazolomycin_OzmH5_KS9_eDB': 'Clade_69', 'thailandamide_TaiL1_KS9_eDB': 'Clade_69', 'kalimantacin_batumin_Bat31_KS8_eDB': 'Clade_69', 'psymberin_PsyD3_KS5_bDOH': 'Clade_59', 'onnamide_OnnI3_KS6_bDOH': 'Clade_59', 'pederin_PedF3_KS6_bDOH': 'Clade_59', 'diaphorin_DipT3_KS6_bDOH': 'Clade_59', 'misakinolide_MisF3_KS17_bDOH': 'Clade_59', 'tolytoxin_TtoF3_KS17_bDOH': 'Clade_59', 'luminaolid_LumE3_KS17_bDOH': 'Clade_59', 'misakinolide_MisE3_KS13_bDOH': 'Clade_59', 'tolytoxin_TtoE7_KS13_bDOH': 'Clade_59', 'luminaolid_LumD3_KS13_bDOH': 'Clade_59', 'chivosazole_ChiB2_KS2_bDOH': 'Clade_124', 'disorazole_DszA4_KS4_bDOH': 'Clade_122', 'bryostatin_BryA_KS33_bDOH': 'Clade_115', 'rhizoxins_RhiC3_KS8_bDOH': 'Clade_111', 'phormidolide_phmF_4_KS7_bOH': 'Clade_111', 'phormidolide_phmI_3_KS15_bOH': 'Clade_111', 'griseoviridin_SgvE12_KS2_bDOH': 'Clade_112', 'virginiamycin_VirA2_KS2_aLMebDOH': 'Clade_112', 'rhizopodin_RizB8_KS8_bDOMe': 'Clade_81', 'rhizopodin_RizE2_KS18_bLOMe': 'Clade_81', 'rhizopodin_RizB4_KS4_aDMebDOMe': 'Clade_81', 'luminaolid_LumB1_KS4_aDMebDOMe': 'Clade_81', 'tolytoxin_TtoD1_KS4_aDMebDOMe': 'Clade_81', 'misakinolide_MisC4_KS4_bOMe': 'Clade_81', 'rhizopodin_RizD4_KS14_bDOMe': 'Clade_81', 'etnangien_EtnG3_KS13_bLOMe': 'Clade_83', 'sorangicin_SorG2_KS19_bLOH': 'Clade_83', 'calyculin_CalF4_KS19_bDOMe': 'Clade_83', 'calyculin_CalE7_KS15_bLOH': 'Clade_83', 'tolytoxin_TtoE6_KS12_bDOMe': 'Clade_83', 'misakinolide_MisE2_KS12_bDOMe': 'Clade_83', 'luminaolid_LumD2_KS12_bDOMe': 'Clade_83', 'oxazolomycin_OzmK1_KS12_aLOMe': 'Clade_83', 'elansolid_Csan_ElaQ2_KS12_bLOH': 'Clade_78', 'elansolid_Cpin_ElsP2_KS12_bLOH': 'Clade_78', 'kalimantacin_batumin_Bat22_KS3_bOH': 'Clade_56', 'sorangicin_SorA5_KS5_aLOHbLOH': 'Clade_56', 'sorangicin_SorD2_KS14_bLOH': 'Clade_56', 'difficidin_DifI2_KS8_bOH': 'Clade_56', 'thailandamide_TaiD2_KS2_bLOH': 'Clade_56', 'oocydin_Smar_OocN3_KS7_bLOH': 'Clade_56', 'oocydin_Ddad_OocN3_KS7_bLOH': 'Clade_56', 'phormidolide_phmH_3_KS11_bOH': 'Clade_56', 'rhizoxins_RhiE2_KS13_bLOH': 'Clade_56', 'bryostatin_BryB4_KS7_bLOH': 'Clade_56', 'bryostatin_BryD1_KS12_bLOH': 'Clade_56', 'bryostatin_BryA2_KS2_bLOH': 'Clade_56', 'diaphorin_DipT6_KS9_bLOH': 'Clade_56', 'pederin_PedF6_KS9_bLOH': 'Clade_56', 'onnamide_OnnI6_KS9_bLOH': 'Clade_56', 'misakinolide_MisD3_KS9_bLOH': 'Clade_56', 'tolytoxin_TtoE3_KS9_bLOH': 'Clade_56', 'luminaolid_LumC3_KS9_bLOH': 'Clade_56', 'psymberin_PsyD7_KS9_bLOH': 'Clade_56', 'bongkrekic_acid_BonA4_KS4_bLOH': 'Clade_56', 'SIA7248_SiaE1_KS2_bDOH': 'Clade_56', 'SIA7248_SiaE2_KS3_bLOH': 'Clade_56', 'SIA7248_SiaF1_KS4_bDOH': 'Clade_56', 'SIA7248_SiaF3_KS6_bDOH': 'Clade_56', 'SIA7248_SiaF4_KS7_bDOH': 'Clade_56', 'myxovirescin_Ta12_KS2_bLOH': 'Clade_116', 'kalimantacin_batumin_Bat34_KS11_redbMe': 'Clade_87', 'kalimantacin_batumin_Bat24_KS5_redbMe': 'Clade_87', 'etnangien_EtnD2_KS2_eDBbMe': 'Clade_87', 'kalimantacin_batumin_Bat33_KS10_exometh': 'Clade_87', 'myxovirescin_TaO1_KS8_redbethyl': 'Clade_87', 'bryostatin_BryB1_KS4_exoester': 'Clade_87', 'bryostatin_BryC1_KS8_exoester': 'Clade_87', 'psymberin_PsyA2_KS2_exometh': 'Clade_87', 'phormidolide_phmI_2_KS14_exometh': 'Clade_87', 'oocydin_Smar_OocJ2_KS2_exometh': 'Clade_87', 'oocydin_Ddad_OocJ2_KS2_exometh': 'Clade_87', 'phormidolide_phmE_2_KS2_exometh': 'Clade_87', 'onnamide_OnnB3_KS3_exometh': 'Clade_87', 'nosperin_NspA3_KS3_exometh': 'Clade_87', 'pederin_PedI3_KS3_exometh': 'Clade_87', 'diaphorin_DipP3_KS3_exometh': 'Clade_87', 'FR901464_Fr9GH3_KS9_bDOH': 'Clade_87', 'thailanstatin_TstGH3_KS10_exometh': 'Clade_87', 'myxopyronin_MxnK4_KS10_bMeDB': 'Clade_101', 'corallopyronin_CorL3_KS12_bMeDB': 'Clade_101', 'griseoviridin_SgvE31_KS5_eDB': 'Clade_102', 'virginiamycin_VirF1_KS5_bMeeDB': 'Clade_102', 'corallopyronin_CorL1_KS10_bMeDB': 'Clade_97', 'SIA7248_SiaG1_KS8_bMeDB': 'Clade_82', 'thailandamide_TaiM1_KS13_bMeeDB': 'Clade_82', 'thailandamide_TaiK1_KS7_bMeDB': 'Clade_82', 'bacillaene_Bsub_PksL3_KS6_bMeeDB': 'Clade_82', 'bacillaene_Bamy_BaeL3_KS6_bMeeDB': 'Clade_82', 'elansolid_Cpin_ElsN1_KS6_bMeDB': 'Clade_82', 'elansolid_Csan_ElaO1_KS6_bMeDB': 'Clade_82', 'oocydin_Smar_OocL2_KS4_eDBbMe': 'Clade_82', 'oocydin_Ddad_OocL2_KS4_eDBbMe': 'Clade_82', 'phormidolide_phmF_5_KS8_bMeeDB': 'Clade_82', 'phormidolide_phmI_1_KS13_bMeeDB': 'Clade_82', 'calyculin_CalG3_KS23_bMeDB': 'Clade_82', 'myxovirescin_Ta16_KS6_eDBbMe': 'Clade_82', 'etnangien_EtnE3_KS3_eDBbMe': 'Clade_82', 'bongkrekic_acid_BonA2_KS2_bMeDB': 'Clade_82', 'sorangicin_SorA6_KS6_zDB': 'Clade_82', 'chlorotonil_CtoC2_KS2_bOH': 'Clade_50', 'anthracimycin_AtcD2_KS2_bOH': 'Clade_50', 'macrolactin_MlnB2_KS2_bDOH': 'Clade_50', 'tartrolon_TrtF1_KS9_bDOH': 'Clade_51', 'griseoviridin_SgvE32_KS6_bLOH': 'Clade_51', 'virginiamycin_VirG1_KS6_bDOH': 'Clade_51', 'legioliulin_LglE1_KS5_bOH': 'Clade_128', 'phormidolide_phmF_2_KS5_bOH': 'Clade_117', 'enacyloxin_Bamb_59221_KS5_bDOH': 'Clade_98', 'enacyloxin_Bamb_59231_KS4_bLOH': 'Clade_98', 'enacyloxin_Bamb_59201_KS8_eDB': 'Clade_98', 'enacyloxin_Bamb_59191_KS10_bketo': 'Clade_98', 'enacyloxin_Bamb_59242_KS2_eDB': 'Clade_98', 'enacyloxin_Bamb_59243_KS3_bDOH': 'Clade_98', 'enacyloxin_Bamb_59212_KS7_bDOH': 'Clade_98', 'thailandamide_TaiL3_KS11_bDOH': 'Clade_52', 'dorrigocin_migrastatin_MgsF1_KS4_bDOH_eDB': 'Clade_52', 'cycloheximide_ChxE4_KS4_bDOH': 'Clade_52', '9-methylstreptimidone_SmdI4_KS4_eDB': 'Clade_52', 'FR901464_Fr9GH2_KS10_exometh': 'Clade_52', 'thailanstatin_TstGH2_KS9_bDOH': 'Clade_52', 'misakinolide_MisC2_KS2_bDOH': 'Clade_29', 'macrolactin_MlnD2_KS6_bDOH': 'Clade_29', 'legioliulin_LglD3_KS3_bketo': 'Clade_29', 'kirromycin_KirAIV4_KS10_bLOH': 'Clade_29', 'anthracimycin_AtcF3_KS10_bketo': 'Clade_29', 'chlorotonil_CtoE2_KS10_bketo': 'Clade_29', 'chivosazole_ChiC5_KS8_bLOH': 'Clade_29'}