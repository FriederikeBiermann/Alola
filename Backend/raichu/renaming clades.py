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
                changed_id=split_id[0]+"_"+split_id[1]+"_"+split_id[2]+"_"+"".join(split_id[3:])
                print(changed_id)
                dictionary_clades_to_fasta_transator[changed_id]=str(indi_file.name.split(".")[0])
print(dictionary_clades_to_fasta_transator)

{'basiliskamides_P615_BasE_2KS3aDMebDOH': 'Clade_140', 'psymberin_PsyD_3_KS5bDOH': 'Clade_140', 'thailandamide_TaiL_3_KS11bDOH': 'Clade_140', 'thiomarinol_TmpA_3_KS7bOH': 'Clade_124', 'mupirocin_MmpA_3_KS7bDOH': 'Clade_124', 'oocydin_Smar_OocR_2KS12shDB': 'Clade_25', 'oocydin_Ddad_OocR_2KS12shDB': 'Clade_25', 'rhizoxins_RhiD_2_KS10shD': 'Clade_25', 'paenimacrolidin_KS2_DB_': 'Clade_25', 'chivosazole_ChiC_3_KS6eDBzDB': 'Clade_127', 'chivosazole_ChiF_3_KS17eDBzDB': 'Clade_127', 'disorazole_DszB_3_KS7eDB': 'Clade_127', 'chlorotonil_CtoD_1_KS5eDB': 'Clade_127', 'bongkrekic_acid_BonA_KS11GNATstarter': 'Clade_32', 'enacyloxin_Bamb_5924_2KS2eDB': 'Clade_32', 'enacyloxin_Bamb_5924_3KS3bDOH': 'Clade_32', 'enacyloxin_Bamb_5923_1KS4bLOH': 'Clade_32', 'enacyloxin_Bamb_5922_1KS5bDOH': 'Clade_32', 'enacyloxin_Bamb_5921_2KS7bDOH': 'Clade_32', 'enacyloxin_Bamb_5920_1KS8eDB': 'Clade_32', 'enacyloxin_Bamb_5920_2KS9aMeDB': 'Clade_32', 'enacyloxin_Bamb_5919_1KS10bketo': 'Clade_32', 'psymberin_PsyD_9_KS11bketo': 'Clade_32', '2qo3_chainA_EryKS3_OUTGROUP': 'Clade_32', '2hg4_chainA_EryKS5_OUTGROUP': 'Clade_32', 'SIA7248_SiaI_1_KS132biModOH': 'Clade_32', 'FR901464_Fr9H_3_KS9bDOH': 'Clade_135', 'thailanstatin_TstGH_2_KS9bDOH': 'Clade_135', 'phormidolide_EKU96423_PhorL_2KS5bDOH': 'Clade_7', 'phormidolide_EKU96423_PhorL_4KS7bDOH': 'Clade_7', 'rhizoxins_RhiC_3_KS8bDOH': 'Clade_7', 'kirromycin_KirAIV_1_KS7eDB': 'Clade_101', 'kirromycin_KirAIV_2_KS8aMeeDB': 'Clade_101', 'leinamycin_LnmI_2_KS2AAoxz': 'Clade_101', 'oxazolomycin_OzmN_2_KS3eDB': 'Clade_101', 'rhizopodin_RizD_5_KS15bimodbOH': 'Clade_101', 'dorrigocin_migrastatin_MgsF_3KS6aMeeDB': 'Clade_116', 'psymberin_PsyD_8_KS10aMebketo': 'Clade_116', 'thailandamide_TaiL_2_KS10bketo': 'Clade_116', 'chivosazole_ChiE_2_KS14aLMebLOH': 'Clade_68', 'sorangicin_SorD_1_KS13aLOHbLOH': 'Clade_68', 'sorangicin_SorG_1_KS18aLMbLOH': 'Clade_68', 'chivosazole_ChiB_3_KS3aLMebLOH': 'Clade_86', 'luminaolid_LumB_3_KS6redaLMe': 'Clade_86', 'misakinolide_MisD_1_KS6redaLMe': 'Clade_86', 'rhizopodin_RizB_6_KS6redaLMe': 'Clade_86', 'rhizopodin_RizC_1_KS9adiMebLOH': 'Clade_86', 'tolytoxin_TtoD_3_KS6redaLMe': 'Clade_86', 'anthracimycin_AtcD_4_KS4aMezshDB': 'Clade_86', 'luminaolid_LumA_1_KS1AAgly': 'Clade_10', 'oxazolomycin_OzmH_2_KS6AAgly': 'Clade_10', 'tolytoxin_TtoC_1_KS1AAgly': 'Clade_10', 'bryostatin_BryC_4_KS110bDOH': 'Clade_81', 'luminaolid_LumD_1_KS110bimodbDOH': 'Clade_81', 'misakinolide_MisE_1_KS110bDOH': 'Clade_81', 'nosperin_NspC_5_KS5aMebOH': 'Clade_81', 'oxazolomycin_OzmJ_2_KS110aLOMebketo': 'Clade_81', 'thailandamide_TaiN_1_KS160aDMebDOH': 'Clade_81', 'tolytoxin_TtoE_5_KS110bDOH': 'Clade_81', 'calyculin_CalE_5_KS140bLOH': 'Clade_81', 'calyculin_CalF_3_KS180bDOH': 'Clade_81', 'oocydin_Smar_OocS_2KS14aMezDB': 'Clade_65', 'oocydin_Ddad_OocS_2KS14aMezDB': 'Clade_65', '9-methylstreptimidone_SmdI_1_KS1unusualstarterAMT': 'Clade_8', 'cycloheximide_ChxE_1_KS1unusualStarterAMT': 'Clade_8', 'dorrigocin_migrastatin_MgsE_1KS1unusualStarterAMT': 'Clade_8', 'etnangien_EtnD_1_KS1unusualStartersSucc': 'Clade_8', 'sorangicin_SorA_1_KS1unusualStarter': 'Clade_8', '9-methylstreptimidone_SmdI_4_KS4eDB': 'Clade_110', 'bryostatin_BryA_KS3_3bDOH': 'Clade_102', 'bryostatin_BryD_2_KS130bDOH': 'Clade_102', 'cycloheximide_ChxE_4_KS4bDOH': 'Clade_110', 'diaphorin_DipP_2_KS2aLMebDOH': 'Clade_61', 'diaphorin_DipT_3_KS6bDOH': 'Clade_123', 'difficidin_DifG_1_KS4OH': 'Clade_62', 'dorrigocin_migrastatin_MgsF_1KS4bDOHeDB': 'Clade_110', 'elansolid_Csan_ElaQ_1KS11aLMebDOH': 'Clade_62', 'elansolid_Cpin_ElsP_1KS11aLMebDOH': 'Clade_62', 'etnangien_EtnD_3_KS3bDOH': 'Clade_62', 'etnangien_EtnF_2_KS9bDOH': 'Clade_62', 'etnangien_EtnI_2_KS18aLMebDOH': 'Clade_62', 'etnangien_EtnI_3_KS19aLMebDOH': 'Clade_62', 'kalimantacin_batumin_Bat2_3KS4bOH': 'Clade_62', 'luminaolid_LumD_3_KS13bDOH': 'Clade_102', 'luminaolid_LumE_3_KS17bDOH': 'Clade_102', 'misakinolide_MisE_3_KS13bDOH': 'Clade_102', 'misakinolide_MisF_3_KS17bDOH': 'Clade_102', 'myxovirescin_Ta1_2_KS2bLOH': 'Clade_62', 'nosperin_NspA_2_KS2aLMebDOH': 'Clade_61', 'onnamide_OnnB_2_KS2aLMeDOH': 'Clade_61', 'onnamide_OnnI_3_KS6bDOH': 'Clade_102', 'pederin_PedI_2_KS2aLMebDOH': 'Clade_61', 'pederin_PedF_3_KS6bDOH': 'Clade_123', 'phormidolide_EKU96423_PhorL_1KS4aMebDOH': 'Clade_102', 'tolytoxin_TtoE_7_KS13bDOH': 'Clade_102', 'tolytoxin_TtoF_3_KS17bDOH': 'Clade_102', 'basiliskamides_P615_14890_KS5eDB': 'Clade_1', 'bryostatin_BryX_1_KS14GNATstarter': 'Clade_1', 'diaphorin_DipP_1_KS1GNATstarter': 'Clade_1', 'kalimantacin_batumin_Bat1_1KS1AcStarter': 'Clade_1', 'nosperin_NspA_1_KS1GNATstarter': 'Clade_1', 'onnamide_OnnB_1_KS1GNATstarter': 'Clade_1', 'pederin_PedI_1_KS1GNATStarter': 'Clade_1', 'psymberin_PsyA_1_KS1GNATStarter': 'Clade_1', 'bryostatin_BryC_2_KS9pyran': 'Clade_26', 'diaphorin_DipT_5_KS8pyran': 'Clade_26', 'luminaolid_LumE_2_KS16pyran': 'Clade_26', 'misakinolide_MisF_2_KS16pyran': 'Clade_26', 'onnamide_OnnI_5_KS8pyran': 'Clade_26', 'oocydin_Smar_OocN_4KS8furan': 'Clade_26', 'oocydin_Ddad_OocN_4KS8furan': 'Clade_26', 'pederin_PedF_5_KS8pyran': 'Clade_26', 'phormidolide_EKU96420_PhorO_4KS12furan': 'Clade_26', 'psymberin_PsyD_5_KS7pyran': 'Clade_26', 'sorangicin_SorB_2_KS9pyran': 'Clade_26', 'sorangicin_SorE_2_KS16pyran': 'Clade_26', 'sorangicin_SorH_1_KS20pyrane': 'Clade_26', 'tolytoxin_TtoF_2_KS16pyran': 'Clade_26', 'oocydin_Smar_OocJ_1KS1unusualStarter': 'Clade_67', 'oocydin_Ddad_OocJ_1KS1unusualStarter': 'Clade_67', 'phormidolide_EKU96424_PhorK_1KS1unusualStarter': 'Clade_67', 'FR901464_Fr9H_2_KS10exometh': 'Clade_14', 'bryostatin_BryB_1_KS4exoester': 'Clade_14', 'bryostatin_BryC_1_KS8exoester': 'Clade_14', 'diaphorin_DipP_3_KS3exometh': 'Clade_14', 'etnangien_EtnD_2_KS2eDBbMe': 'Clade_14', 'kalimantacin_batumin_Bat2_4KS5redbMe': 'Clade_14', 'kalimantacin_batumin_Bat3_3KS10exometh': 'Clade_14', 'kalimantacin_batumin_Bat3_4KS11redbMe': 'Clade_14', 'myxovirescin_TaO_1_KS8redbethyl': 'Clade_14', 'nosperin_NspA_3_KS3exometh': 'Clade_14', 'onnamide_OnnB_3_KS3exometh': 'Clade_14', 'oocydin_Smar_OocJ_2KS2exometh': 'Clade_14', 'oocydin_Ddad_OocJ_2KS2exometh': 'Clade_14', 'pederin_PedI_3_KS3exometh': 'Clade_14', 'phormidolide_EKU96424_PhorK_2KS2exometh': 'Clade_14', 'phormidolide_EKU96419_PhorP_1KS13redbMe': 'Clade_14', 'psymberin_PsyA_2_KS2exometh': 'Clade_14', 'thailanstatin_TstGH_3_KS10exometh': 'Clade_14', 'paenimacrolidin_KS5_bMe_': 'Clade_14', 'chivosazole_ChiC_5_KS8bLOH': 'Clade_40', 'kirromycin_KirAIV_4_KS10bLOH': 'Clade_40', 'macrolactin_MlnD_2_KS6bDOH': 'Clade_40', 'anthracimycin_AtcF_3_KS10bketo': 'Clade_40', 'chlorotonil_CtoE_2_KS10bketo': 'Clade_40', 'FR901464_Fr9G_1_KS8eDB': 'Clade_99', 'bryostatin_BryB_3_KS6eDB': 'Clade_99', 'bryostatin_BryX_2_KS150': 'Clade_99', 'difficidin_DifK_1_KS13eDB': 'Clade_99', 'onnamide_OnnJ_2_KS12bimodeDB': 'Clade_99', 'pederin_PedH_3_KS12bimodbOH': 'Clade_99', 'phormidolide_EKU96419_PhorP_2KS14bDOH': 'Clade_99', 'rhizoxins_RhiB_4_KS5eDB': 'Clade_99', 'thailandamide_TaiD_3_KS3eDB': 'Clade_99', 'thailandamide_TaiM_2_KS14eDB': 'Clade_99', 'thailanstatin_TstGH_1_KS8eDB': 'Clade_99', 'calyculin_CalC_3_KS9eDB': 'Clade_99', 'calyculin_CalG_4_KS24eDB': 'Clade_99', 'bacillaene_Bamy_BaeR_1KS130aMeDB': 'Clade_142', 'bacillaene_Bsub_PksR_1KS14OaMeDB': 'Clade_142', 'chivosazole_ChiF_4_KS180zDB': 'Clade_142', 'nosperin_NspC_3_KS60biomodaMeeDB': 'Clade_142', 'onnamide_OnnI_7_KS100red': 'Clade_142', 'rhizoxins_RhiD_3_KS110bimodaMeeDB': 'Clade_142', 'calyculin_CalH_3_KS27eDB': 'Clade_142', 'bacillaene_Bamy_BaeM_2KS9zDBaMe': 'Clade_141', 'bacillaene_Bsub_PksM_2KS9zDBaMe': 'Clade_141', 'difficidin_DifI_1_KS7aMezDB': 'Clade_141', 'chivosazole_ChiD_1_KS100AAoxz': 'Clade_36', 'corallopyronin_CorJ_2_KS50aMe': 'Clade_84', 'disorazole_DszC_1_KS90AAoxz': 'Clade_36', 'disorazole_DszC_1_KS20AAoxz': 'Clade_84', 'elansolid_Csan_ElaR_1KS140eDB': 'Clade_76', 'elansolid_ElsQ_1_KS140eDB': 'Clade_76', 'enacyloxin_Bamb_5919_2KS110eDB': 'Clade_76', 'griseoviridin_SgvE4_1_KS7bDOH': 'Clade_120', 'leinamycin_LnmI_1_KS10AAoxz': 'Clade_36', 'luminaolid_LumA_3_KS30bimodaDMebDOH': 'Clade_94', 'luminaolid_LumE_4_KS180bDOH': 'Clade_76', 'misakinolide_MisC_3_KS30bimodbDOMe': 'Clade_94', 'misakinolide_MisF_5_KS190eDB': 'Clade_76', 'pederin_PedH_4_KS130eDB': 'Clade_76', 'rhizopodin_RizB_3_KS30bimodaDMebDOH': 'Clade_85', 'rhizopodin_RizB_7_KS70bimodbDOH': 'Clade_85', 'rhizopodin_RizD_1_KS110AAoxa': 'Clade_36', 'rhizopodin_RizD_3_KS130bimodbDOH': 'Clade_85', 'rhizopodin_RizE_1_KS17obimodbLOH': 'Clade_85', 'rhizoxins_RhiB_1_KS20AAoxa': 'Clade_36', 'rhizoxins_RhiF_2_KS160eDB': 'Clade_76', 'sorangicin_SorB_1_KS80zDB': 'Clade_76', 'tartrolon_TrtF_2_KS100redaDMe': 'Clade_120', 'tolytoxin_TtoC_3_KS30aDMebDOH': 'Clade_94', 'tolytoxin_TtoF_5_KS190eDB': 'Clade_76', 'virginiamycin_VirH_1_KS70AAoxz': 'Clade_120', 'calyculin_CalC_1_KS7KS0oxa': 'Clade_36', 'myxopyronin_MxnJ_2_KS50redaLMe': 'Clade_84', 'corallopyronin_CorI_2_KS2AAGly': 'Clade_39', 'lankacidin_LkcA_1_KS1AAgly': 'Clade_39', 'myxopyronin_MxnI_2_KS2AAgly': 'Clade_39', 'FR901464_Fr9I_1_KS110bDOH': 'Clade_79', 'griseoviridin_SgvE1_1_KS1acetylStarter': 'Clade_79', 'kirromycin_KirAI_1_KS1AcStarter': 'Clade_79', 'lankacidin_LkcG_1_KS5aMebketo': 'Clade_79', 'thailanstatin_TstI_1_KS110bDOH': 'Clade_79', 'virginiamycin_VirA_1_KS1unusualstarter': 'Clade_79', 'elansolid_Csan_ElaJ_2KS2eDB': 'Clade_141', 'elansolid_Csan_ElaQ_3KS13aMeDB': 'Clade_141', 'elansolid_Cpin_ElsI_2KS2eDB': 'Clade_141', 'elansolid_Cpin_ElsP_3KS13aMeDB': 'Clade_141', 'bacillaene_Bamy_BaeL_1KS4zD': 'Clade_65', 'bacillaene_Bamy_BaeM_1KS8zDB': 'Clade_65', 'bacillaene_Bsub_PksL_1KS4zD': 'Clade_65', 'bacillaene_Bsub_PksM_1KS8zDB': 'Clade_65', 'difficidin_DifH_1_KS6zDB': 'Clade_65', 'basiliskamides_P615_BasE_3KS3bOH': 'Clade_30', 'chivosazole_ChiC_2_KS5bimodbOH': 'Clade_30', 'chivosazole_ChiD_3_KS12bimodbOH': 'Clade_30', 'chivosazole_ChiF_2_KS16bimodbOH': 'Clade_30', 'difficidin_DifI_4_KS10bimodbOH': 'Clade_30', 'elansolid_Csan_ElaO_2KS7bimodbDOH': 'Clade_30', 'elansolid_Cpin_ElsN_2KS7bimodbDOH': 'Clade_30', 'etnangien_EtnG_4_KS140bOH': 'Clade_30', 'kirromycin_KirAI_2_KS2zcrotonyl': 'Clade_30', 'kirromycin_KirAIV_5_KS11bDOH': 'Clade_30', 'leinamycin_LnmI_3_KS3zDB': 'Clade_30', 'macrolactin_MlnE_2_KS8bimodbOH': 'Clade_30', 'macrolactin_MlnG_1_KS11bimodbOH': 'Clade_30', 'tartrolon_TrtD_KS3_3bimodbOH': 'Clade_30', 'calyculin_CalA_KS1_KS0AAser': 'Clade_28', 'FR901464_Fr9D_1_KS4AAthr': 'Clade_28', 'bacillaene_Bamy_BaeJ_1KS1Agly': 'Clade_28', 'bacillaene_Bamy_BaeN_1KS10AAala': 'Clade_28', 'bacillaene_Bsub_PksJ_1KS1AAgly': 'Clade_28', 'bacillaene_Bsub_PksN_1KS11AAala': 'Clade_28', 'diaphorin_DipT_2_KS5AAgly': 'Clade_28', 'griseoviridin_SgvE2_1_KS3AAgly': 'Clade_28', 'kalimantacin_batumin_Bat2_1KS2AAGly': 'Clade_28', 'malleilactone_burkholderic_acid_BurA1KS1unusualStarter': 'Clade_28', 'myxovirescin_Ta1_1_KS1AAgly': 'Clade_28', 'nosperin_NspC_2_KS5AAgly': 'Clade_28', 'onnamide_OnnI_2_KS5AAgly': 'Clade_28', 'oxazolomycin_OzmN_1_KS2AAoxa': 'Clade_28', 'oxazolomycin_OzmQ_1_KS1AAgly': 'Clade_28', 'pederin_PedF_2_KS5AAgly': 'Clade_28', 'psymberin_PsyD_2_KS4AAgly': 'Clade_28', 'thailandamide_TaiE_1_KS5AAala': 'Clade_28', 'thailanstatin_TstDEF_1_KS4AAthr': 'Clade_28', 'virginiamycin_VirA_3_KS3AAgly': 'Clade_28', 'calyculin_CalB_2_KS4AAgly': 'Clade_28', 'calyculin_CalH_2_KS26AAala': 'Clade_28', 'disorazole_DszB_1_KS5zDB': 'Clade_115', 'disorazole_DszB_2_KS6zDB': 'Clade_115', 'legioliulin_LglD_4_KS4bketo': 'Clade_115', 'rhizopodin_RizB_5_KS5bketo': 'Clade_115', 'SIA7248_SiaF_2_KS5bDOH': 'Clade_115', 'SIA7248_SiaG_2_KS9eDB': 'Clade_115', 'chlorotonil_CtoD_2_KS6eDB': 'Clade_115', 'SIA7248_SiaH_KS12_bketo': 'Clade_115', 'legioliulin_LglD_2_KS2eDB': 'Clade_126', 'mupirocin_MmpB_1_KS8esterification': 'Clade_126', 'rhizopodin_RizD_6_KS16eDB': 'Clade_126', 'chlorotonil_CtoE_1_KS9DBDA': 'Clade_126', 'bacillaene_Bsub_PksM_3KS10bOH': 'Clade_75', 'bongkrekic_acid_BonA_4KS4bLOH': 'Clade_66', 'bryostatin_BryA_2_KS2bLOH': 'Clade_66', 'bryostatin_BryB_4_KS7bLOH': 'Clade_66', 'bryostatin_BryD_1_KS12bLOH': 'Clade_66', 'diaphorin_DipT_6_KS9bLOH': 'Clade_66', 'difficidin_DifI_2_KS8bOH': 'Clade_66', 'elansolid_Csan_ElaP_2KS90bimodbOH': 'Clade_75', 'elansolid_Csan_ElaQ_2KS12bLOH': 'Clade_114', 'elansolid_Cpin_ElsO_2KS90bimodbOH': 'Clade_75', 'elansolid_Cpin_ElsP_2KS12bLOH': 'Clade_114', 'etnangien_EtnF_3_KS10bLOH': 'Clade_75', 'etnangien_EtnG_2_KS120bLOH': 'Clade_75', 'etnangien_EtnI_4_KS200bLOH': 'Clade_75', 'kalimantacin_batumin_Bat2_2KS3bOH': 'Clade_66', 'luminaolid_LumC_3_KS9bLOH': 'Clade_66', 'misakinolide_MisD_3_KS9bLOH': 'Clade_66', 'onnamide_OnnI_6_KS9bLOH': 'Clade_66', 'oocydin_Smar_OocN_3KS7bLOH': 'Clade_66', 'oocydin_Smar_OocS_3KS150bLOH': 'Clade_75', 'oocydin_Ddad_OocN_3KS7bLOH': 'Clade_66', 'oocydin_Ddad_OocS_3KS150bLOH': 'Clade_75', 'pederin_PedF_6_KS9bLOH': 'Clade_66', 'phormidolide_EKU96420_PhorO_3KS11bLOH': 'Clade_66', 'psymberin_PsyD_7_KS9bLOH': 'Clade_66', 'rhizoxins_RhiE_2_KS13bLOH': 'Clade_66', 'sorangicin_SorA_5_KS5aLOHbLOH': 'Clade_66', 'sorangicin_SorD_2_KS14bLOH': 'Clade_66', 'thailandamide_TaiD_2_KS2bLOH': 'Clade_114', 'tolytoxin_TtoE_3_KS9bLOH': 'Clade_66', 'SIA7248_SiaF_1_KS4bDOH': 'Clade_97', 'SIA7248_SiaF_3_KS6bDOH': 'Clade_97', 'SIA7248_SiaF_4_KS7bDOH': 'Clade_97', 'SIA7248_SiaE_1_KS2bDOH': 'Clade_97', 'SIA7248_SiaE_2_KS3bLOH': 'Clade_97', 'bacillaene_Bamy_BaeL_2KS5eD': 'Clade_82', 'bacillaene_Bsub_PksL_2KS5eD': 'Clade_82', 'bongkrekic_acid_BonA_5KS5DB': 'Clade_82', 'bongkrekic_acid_BonB_1KS7DB': 'Clade_82', 'bongkrekic_acid_BonC_1KS9eDB': 'Clade_82', 'bongkrekic_acid_BonD_2KS11eDB': 'Clade_82', 'elansolid_Csan_ElaK_3KS5eDB': 'Clade_82', 'elansolid_Csan_ElaP_3KS10zDB': 'Clade_82', 'elansolid_Cpin_ElsJ_3KS5eDB': 'Clade_82', 'elansolid_Cpin_ElsO_3KS10zDB': 'Clade_82', 'etnangien_EtnD_4_KS4eDB': 'Clade_82', 'etnangien_EtnE_1_KS5eDB': 'Clade_82', 'etnangien_EtnE_2_KS6eDB': 'Clade_82', 'kalimantacin_batumin_Bat2_5KS6eD': 'Clade_82', 'sorangicin_SorB_3_KS10eDB': 'Clade_82', 'sorangicin_SorE_3_KS17eDB': 'Clade_82', 'sorangicin_SorH_2_KS21eDB': 'Clade_82', 'sorangicin_SorI_1_KS23zDB': 'Clade_82', 'FR901464_Fr9I_2_KS120pyran': 'Clade_38', 'thailanstatin_TstI_2_KS120pyran': 'Clade_38', 'albicidin_AlbI_2_KS2aMeeDB': 'Clade_141', 'calyculin_CalG_2_KS22aMeDB': 'Clade_141', 'diaphorin_DipT_4_KS7adiMebOH': 'Clade_138', 'luminaolid_LumC_1_KS7aLMebLOMeaLMebLOH': 'Clade_89', 'luminaolid_LumC_4_KS10aLMebLOH': 'Clade_112', 'mupirocin_MmpA_KS2_bDOH': 'Clade_89', 'misakinolide_MisD_4_KS10aLMebLOH': 'Clade_112', 'thiomarinol_TmpD_2_KS2aLMebLOH': 'Clade_89', 'onnamide_OnnI_4_KS7adiMebDOH': 'Clade_111', 'oocydin_Smar_OocS_1KS13aMebOH': 'Clade_138', 'oocydin_Ddad_OocS_1KS13aMebOH': 'Clade_138', 'pederin_PedF_4_KS7adiMebDOH': 'Clade_138', 'phormidolide_EKU96423_PhorL_3KS6adiMebDOH': 'Clade_111', 'psymberin_PsyD_4_KS6adiMebDOH': 'Clade_111', 'psymberin_PsyD_6_KS8aDMebLOH': 'Clade_112', 'rhizoxins_RhiC_2_KS7aDMebLOH': 'Clade_112', 'rhizoxins_RhiD_1_K9aMebDOH': 'Clade_111', 'tolytoxin_TtoE_1_KS7aDMebDOH': 'Clade_89', 'tolytoxin_TtoE_4_KS10aLMebLOH': 'Clade_112', 'calyculin_CalE_4_KS13bLOH': 'Clade_112', 'calyculin_CalF_5_KS20aLMebLOH': 'Clade_112', 'calyculin_CalG_1_KS21aLMebLOH': 'Clade_111', 'griseoviridin_SgvE2_2_KS4eDB': 'Clade_100', 'tartrolon_TrtF_1_KS9bDOH': 'Clade_100', 'virginiamycin_VirA_4_KS4eDB': 'Clade_100', 'corallopyronin_CorL_3_KS12bMeDB': 'Clade_104', 'etnangien_EtnI_1_KS17redaLMe': 'Clade_104', 'griseoviridin_SgvE3_1_KS5eDB': 'Clade_104', 'luminaolid_LumB_1_KS4aDMebDOMe': 'Clade_104', 'misakinolide_MisC_4_KS4bOMe': 'Clade_104', 'rhizopodin_RizB_4_KS4aDMebDOMe': 'Clade_104', 'rhizopodin_RizB_8_KS8bDOMe': 'Clade_104', 'rhizopodin_RizD_4_KS14bDOMe': 'Clade_104', 'rhizopodin_RizE_2_KS18bLOMe': 'Clade_104', 'tolytoxin_TtoD_1_KS4aDMebDOMe': 'Clade_104', 'virginiamycin_VirF_1_KS5bMeeDB': 'Clade_104', 'myxopyronin_MxnK_4_KS10bMeDB': 'Clade_104', 'chivosazole_ChiE_1_KS13zDBeDB': 'Clade_90', 'luminaolid_LumB_2_KS5bketo': 'Clade_90', 'macrolactin_MlnC_1_KS4eDB': 'Clade_90', 'macrolactin_MlnD_1_KS5eDB': 'Clade_90', 'macrolactin_MlnE_1_KS7bDOH': 'Clade_90', 'macrolactin_MlnF_1_KS9zDzDB': 'Clade_90', 'mupirocin_MmpE_1_KS9cyclization': 'Clade_90', 'tolytoxin_TtoD_2_KS5bketo': 'Clade_90', '9-methylstreptimidone_SmdI_3_KS3vinylogous': 'Clade_12', 'corallopyronin_CorJ_3_KS6aDMe': 'Clade_96', 'cycloheximide_ChxE_3_KS3vinylogous': 'Clade_12', 'dorrigocin_migrastatin_MgsE_3KS3vinylogous': 'Clade_12', 'kirromycin_KirAII_2_KS4diMbLOH': 'Clade_96', 'kirromycin_KirAIII_4_KS6AAgly': 'Clade_96', 'kirromycin_KirAIV_3_KS9aMebketo': 'Clade_96', 'rhizoxins_RhiF_1_KS15vinylogous': 'Clade_96', 'myxopyronin_MxnJ_3_KS6redaLMe': 'Clade_96', 'corallopyronin_CorK_3_KS9red': 'Clade_109', 'corallopyronin_CorL_2_KS11red': 'Clade_109', 'legioliulin_LglD_1_KS1aromaticStarter': 'Clade_95', 'legioliulin_LglD_3_KS3bketo': 'Clade_95', 'macrolactin_MlnB_3_KS3red': 'Clade_109', 'misakinolide_MisC_5_KS5LOHorDPY': 'Clade_95', 'rhizopodin_RizB_2_KS2eDB': 'Clade_109', 'myxopyronin_MxnK_3_KS9red': 'Clade_109', 'kirromycin_KirAV_1_KS12eDB': 'Clade_128', 'lankacidin_LkcF_1_KS3bDOH': 'Clade_128', 'oxazolomycin_OzmH_3_KS7eDB': 'Clade_128', 'anthracimycin_AtcF_2_KS9eDBDA': 'Clade_128', 'anthracimycin_AtcE_KS5_eDB': 'Clade_128', 'anthracimycin_AtcE_KS6_eDB': 'Clade_128', 'diaphorin_DipT_1_KS40acetal': 'Clade_93', 'nosperin_NspC_1_KS40hacetal': 'Clade_93', 'onnamide_OnnI_1_KS40hacetale': 'Clade_93', 'pederin_PedF_1_KS40hacetal': 'Clade_93', 'nosperin_NspC_4_KS7aMeshDB': 'Clade_49', 'onnamide_OnnJ_1_KS11bOH': 'Clade_49', 'rhizoxins_RhiE_1_KS1aMeshDB': 'Clade_49', 'calyculin_CalI_1_KS24shDB': 'Clade_49', 'bacillaene_Bamy_BaeN_2KS11shDB': 'Clade_25', 'bacillaene_Bamy_BaeN_3KS12shDB': 'Clade_25', 'bacillaene_Bsub_PksN_2KS12shDB': 'Clade_25', 'bacillaene_Bsub_PksN_3KS13shDB': 'Clade_25', 'luminaolid_LumE_1_KS15zDB': 'Clade_65', 'misakinolide_MisF_1_KS15zDB': 'Clade_65', 'tolytoxin_TtoF_1_KS15zDB': 'Clade_65', 'chivosazole_ChiC_6_KS90aDMebDOH': 'Clade_94', 'thiomarinol_TmpA_2_KS6aDOHbDOH': 'Clade_121', 'mupirocin_MmpA_2_KS6aDOHbDOH': 'Clade_121', 'myxovirescin_Ta1_4_KS4bLOH': 'Clade_121', 'calyculin_CalF_2_KS17aDOHbDOH': 'Clade_121', 'bacillaene_Bamy_BaeL_3KS6bMeeDB': 'Clade_73', 'bacillaene_Bsub_PksL_3KS6bMeeDB': 'Clade_73', 'bongkrekic_acid_BonA_2KS2bMeDB': 'Clade_73', 'elansolid_Csan_ElaO_1KS6bMeDB': 'Clade_73', 'elansolid_Cpin_ElsN_1KS6bMeDB': 'Clade_73', 'etnangien_EtnE_3_KS3eDBbMe': 'Clade_73', 'myxovirescin_Ta1_6_KS6eDBbMe': 'Clade_73', 'oocydin_Smar_OocL_2KS4eDBbMe': 'Clade_73', 'oocydin_Ddad_OocL_2KS4eDBbMe': 'Clade_73', 'phormidolide_EKU96423PhorL_5_KS8eDBbMe': 'Clade_73', 'sorangicin_SorA_6_KS6zDB': 'Clade_73', 'thailandamide_TaiK_1_KS7bMeDB': 'Clade_73', 'thailandamide_TaiM_1_KS13bMeeDB': 'Clade_73', 'calyculin_CalG_3_KS23bMeDB': 'Clade_73', 'SIA7248_SiaG_1_KS8bMeDB': 'Clade_73', 'diaphorin_DipO_1_KS10rearrangement': 'Clade_35', 'oocydin_Smar_OocL_1KS3rearrangement': 'Clade_35', 'oocydin_Ddad_OocL_1KS3rearrangement': 'Clade_35', 'pederin_PedH_1_KS10rearrangement': 'Clade_35', 'etnangien_EtnG_3_KS13bLOMe': 'Clade_103', 'luminaolid_LumD_2_KS12bDOMe': 'Clade_103', 'misakinolide_MisE_2_KS12bDOMe': 'Clade_103', 'oxazolomycin_OzmK_1_KS12aLOMe': 'Clade_103', 'sorangicin_SorG_2_KS19bLOH': 'Clade_103', 'tolytoxin_TtoE_6_KS12bDOMe': 'Clade_103', 'calyculin_CalE_7_KS15bLOH': 'Clade_103', 'calyculin_CalF_4_KS19bDOMe': 'Clade_103', 'bongkrekic_acid_BonA_3KS3aMeDB': 'Clade_23', 'bongkrekic_acid_BonD_1KS10aLMe': 'Clade_23', 'chlorotonil_CtoD_3_KS7redaMe': 'Clade_23', 'oocydin_Smar_OocN_2KS6aDOHbLOH': 'Clade_70', 'oocydin_Ddad_OocN_2KS6aDOHbLOH': 'Clade_70', 'phormidolide_EKU96420_PhorO_2KS100aOHaMebDOH': 'Clade_70', 'sorangicin_SorA_4_KS4aMeeDB': 'Clade_141', 'sorangicin_SorC_1_KS12eDB': 'Clade_141', '9-methylstreptimidone_SmdI_2_KS2ozDB': 'Clade_64', 'cycloheximide_ChxE_2_KS20zDB': 'Clade_64', 'dorrigocin_migrastatin_MgsE_2KS20zDB': 'Clade_64', 'rhizoxins_RhiE_3_KS140eDB': 'Clade_64', 'corallopyronin_CorK_1_KS7acetyl': 'Clade_27', 'disorazole_DszA_1_KS1acetylStarter': 'Clade_27', 'macrolactin_MlnB_1_KS1acetylStarter': 'Clade_27', 'misakinolide_MisC_1_KS1acetylStarter': 'Clade_27', 'chlorotonil_CtoC_1_KS1acetylStarter': 'Clade_27', 'myxopyronin_MxnK_1_KS7starter': 'Clade_27', 'anthracimycin_AtcD_1_KS1acetylStarter': 'Clade_27', 'FR901464_Fr9C_1_KS1unusualstarterlactate': 'Clade_13', 'bryostatin_BryA_1_KS1lactateStarter': 'Clade_13', 'tartrolon_TrtD_1_KS1unusualStarterlactate': 'Clade_13', 'thailanstatin_TstC_1_KS1lactateStarter': 'Clade_13', 'SIA7248_SiaD_1_KS1unusualStarterlactate': 'Clade_13', 'chivosazole_ChiC_1_KS4aDMebDOH': 'Clade_2', 'corallopyronin_CorL_1_KS10bMeDB': 'Clade_2', 'disorazole_DszA_3_KS3adiMebLOH': 'Clade_2', 'luminaolid_LumC_2_KS8aDMebDOHbDOH': 'Clade_2', 'misakinolide_MisD_2_KS8bLOH': 'Clade_2', 'tolytoxin_TtoE_2_KS8aDMeDOH': 'Clade_2', 'chlorotonil_CtoC_4_KS4aMezshDB': 'Clade_2', 'chlorotonil_CtoD_4_aMeshDB': 'Clade_2', 'anthracimycin_AtcE_KS7_redaMe': 'Clade_2', 'chivosazole_ChiB_2_KS2bDOH': 'Clade_136', 'disorazole_DszA_4_KS4bDOH': 'Clade_136', 'kirromycin_KirAII_3_KS5bDOH': 'Clade_136', 'rhizopodin_RizB_1_KS1AAgly': 'Clade_136', 'bacillaene_Bamy_BaeJ_2KS2red': 'Clade_25', 'bacillaene_Bsub_PksJ_2KS2red': 'Clade_25', 'bongkrekic_acid_BonB_2KS8red': 'Clade_25', 'diaphorin_DipO_2_KS11DB': 'Clade_25', 'difficidin_DifF_3_KS3red': 'Clade_25', 'difficidin_DifI_3_KS9red': 'Clade_25', 'dorrigocin_migrastatin_MgsF_6KS9eDB': 'Clade_25', 'dorrigocin_migrastatin_MgsG_1KS10red': 'Clade_25', 'kalimantacin_batumin_Bat3_2KS9eDB': 'Clade_25', 'myxovirescin_Ta1_5_KS5red': 'Clade_25', 'myxovirescin_TaO_2_KS9red': 'Clade_25', 'myxovirescin_TaO_3_KS10bketo': 'Clade_25', 'myxovirescin_TaO_4_KS11red': 'Clade_25', 'oocydin_Smar_OocN_5KS9red': 'Clade_25', 'oocydin_Ddad_OocN_5KS9red': 'Clade_25', 'pederin_PedH_2_KS11red': 'Clade_25', 'phormidolide_EKU96424_PhorK_3KS3bDOH': 'Clade_25', 'sorangicin_SorA_2_KS2red': 'Clade_25', 'sorangicin_SorB_4_KS11red': 'Clade_25', 'calyculin_CalA_2_KS2AAser': 'Clade_25', 'calyculin_CalE_3_KS12aDMebLOH': 'Clade_25', 'bacillaene_Bamy_BaeR_2KS140shDBMe': 'Clade_98', 'bacillaene_Bsub_PksR_2KS15OshDBaMe': 'Clade_98', 'thailandamide_TaiD_4_KS40redaDMe': 'Clade_98', 'calyculin_CalB_4_KS60redaLMe': 'Clade_98', 'calyculin_CalH_1_KS25bMeDB': 'Clade_98', 'corallopyronin_CorK_2_KS8eDB': 'Clade_118', 'difficidin_DifF_1_KS1unusualStartersacryloyl': 'Clade_118', 'disorazole_DszA_2_KS2eDB': 'Clade_118', 'disorazole_DszB_4_KS80zDB': 'Clade_118', 'calyculin_CalE_2_KS11aketo': 'Clade_118', 'myxopyronin_MxnK_2_KS80red': 'Clade_118', 'oocydin_Smar_OocN_1KS50aDOHbLOH': 'Clade_93', 'oocydin_Ddad_OocN_1KS50aDOHbLOH': 'Clade_93', 'thiomarinol_TmpD_3_KS3eDB': 'Clade_129', 'thiomarinol_TmpB_1_KS8eDBbMe': 'Clade_129', 'mupirocin_MmpD_3_KS3eDB': 'Clade_129', 'corallopyronin_CorI_1_KS1unusualStartermethoxycarbonyl': 'Clade_34', 'myxopyronin_MxnI_1_KS1unusualstarter': 'Clade_34', 'FR901464_Fr9F_4_KS7aMeeDB': 'Clade_141', 'malleilactone_burkholderic_acid_BurF2KS2aMeeDB': 'Clade_141', 'thailandamide_TaiM_3_KS15aMeeDB': 'Clade_141', 'thailanstatin_TstDEF_4_KS7aMeeDB': 'Clade_141', 'corallopyronin_CorI_3_KS30bimodeDB': 'Clade_42', 'corallopyronin_CorJ_1_KS4shDB': 'Clade_42', 'myxopyronin_MxnJ_1_KS4shDB': 'Clade_42', 'myxopyronin_MxnI_3_KS3biModeDB': 'Clade_42', 'chivosazole_ChiF_1_KS15aMeeDB': 'Clade_52', 'corallopyronin_CorL_4_KS13aMeDB': 'Clade_52', 'difficidin_DifF_2_KS2aMeeDB': 'Clade_55', 'misakinolide_MisF_4_KS18aMeeDB': 'Clade_55', 'oxazolomycin_OzmH_1_KS5aMezDB': 'Clade_52', 'rhizoxins_RhiB_3_KS4aMeeDB': 'Clade_55', 'tolytoxin_TtoF_4_KS18aMeeDB': 'Clade_55', 'myxopyronin_MxnK_5_KS11aMeDB': 'Clade_52', 'thiomarinol_TmpD_1_KS1acetylStarter': 'Clade_33', 'mupirocin_MmpD_1_KS1acetylStarter': 'Clade_33', 'thailandamide_TaiD_1_KS1aromaticStarter': 'Clade_33', 'oocydin_Smar_OocN_6KS100bketo': 'Clade_98', 'oocydin_Ddad_OocN_6KS100bketo': 'Clade_98', 'chlorotonil_CtoC_3_KS3eDB': 'Clade_134', 'anthracimycin_AtcD_3_KS3eDB': 'Clade_134', 'basiliskamides_P615_BasF_1KS1GNATstarter': 'Clade_74', 'basiliskamides_P615_BasE_1KS2aLMered': 'Clade_74', 'bryostatin_BryB_2_KS5adiMEbketo': 'Clade_74', 'bryostatin_BryC_3_KS10adiMebketo': 'Clade_74', 'difficidin_DifL_1_KS14redaMe': 'Clade_74', 'dorrigocin_migrastatin_MgsF_4KS7aDMebLOH': 'Clade_74', 'elansolid_Csan_ElaK_1KS3adiMebDOH': 'Clade_74', 'elansolid_Csan_ElaK_2KS4aMe': 'Clade_74', 'elansolid_Cpin_ElsJ_1KS3adiMebDOH': 'Clade_74', 'elansolid_Cpin_ElsJ_2KS4aMe': 'Clade_74', 'etnangien_EtnF_1_KS8aDMebDOH': 'Clade_74', 'thiomarinol_TmpD_4_KS4aDOH': 'Clade_74', 'mupirocin_MmpD_2_KS2aLMebLOH': 'Clade_74', 'mupirocin_MmpD_4_KS4aDMe': 'Clade_74', 'myxovirescin_TaP_1_KS1redaDMe': 'Clade_74', 'sorangicin_SorA_3_KS3redaDMe': 'Clade_74', 'sorangicin_SorE_1_KS15aDMbLOH': 'Clade_74', 'calyculin_CalE_6_KS16adiMbketo': 'Clade_74', 'paenimacrolidin_KS3_bMe_': 'Clade_74', 'paenimacrolidin_KS4_bMe_': 'Clade_74', 'oocydin_Smar_OocR_1KS110bimodbOH': 'Clade_98', 'oocydin_Ddad_OocR_1KS11obimodbOH': 'Clade_98', 'tartrolon_TrtE_2_KS50red': 'Clade_98', 'etnangien_EtnH_2_KS16eDB': 'Clade_130', 'kirromycin_KirAII_1_KS3eDB': 'Clade_130', 'myxovirescin_Ta1_7_KS7eDB': 'Clade_125', 'thailandamide_TaiL_4_KS12eDB': 'Clade_125', 'SIA7248_SiaG_3_KS10eDB': 'Clade_125', 'etnangien_EtnG_1_KS11red': 'Clade_98', 'mupirocin_MmpA_1_KS50bDOH': 'Clade_93', 'thiomarinol_TmpA_1_KS50bDOH': 'Clade_93', 'myxovirescin_Ta1_3_KS30bLOH': 'Clade_93', 'phormidolide_EKU96420_PhorO_1KS9aMeDOH': 'Clade_93', 'psymberin_PsyD_1_KS3bimod0bLOH': 'Clade_93', 'rhizoxins_RhiA_1_KS10GNATStarter': 'Clade_98', 'calyculin_CalB_1_KS3KS0bLOH': 'Clade_93', 'calyculin_CalE_1_KS10KS0ox': 'Clade_98', 'calyculin_CalF_1_KS160bLOHaLMebLOH': 'Clade_93', 'albicidin_AlbI_1_KS1aromaticStarterAL': 'Clade_9', 'elansolid_Csan_ElaJ_1KS1aromaticstarter': 'Clade_9', 'elansolid_Cpin_ElsI_1KS1aromaticstarter': 'Clade_9', 'chivosazole_ChiD_2_KS11AAoxz': 'Clade_5', 'rhizopodin_RizD_2_KS12AAoxa': 'Clade_5', 'rhizoxins_RhiB_2_KS3AAoxa': 'Clade_5', 'calyculin_CalC_2_KS8AAoxa': 'Clade_5', 'FR901464_Fr9C_3_KS30eDB': 'Clade_88', 'oocydin_Smar_OocS_4KS160': 'Clade_88', 'oocydin_Ddad_OocS_4KS160': 'Clade_88', 'phormidolide_EKU96419_PhorP_3KS150eDBbMe': 'Clade_88', 'thailanstatin_TstC_3_KS30eDB': 'Clade_88', 'bacillaene_Bamy_BaeJ_3KS30HbimodbOH': 'Clade_31', 'bacillaene_Bamy_BaeL_4KS70HbimodbOH': 'Clade_31', 'bacillaene_Bsub_PksJ_3KS3OHbimodOH': 'Clade_31', 'bacillaene_Bsub_PksL_4KS7ObimodbOH': 'Clade_31', 'bongkrekic_acid_BonA_6KS60bimodbOH': 'Clade_31', 'difficidin_DifG_2_KS50HbimodbOH': 'Clade_31', 'difficidin_DifJ_2_KS12obimodbOH': 'Clade_31', 'kalimantacin_batuminBat2_6_KS70bimodbOH': 'Clade_31', 'luminaolid_LumD_4_KS140bimodbDOH': 'Clade_31', 'misakinolide_MisE_4_KS140bLOH': 'Clade_31', 'oxazolomycin_OzmH_4_KS80eDB': 'Clade_31', 'sorangicin_SorA_7_KS70bimodbOH': 'Clade_31', 'sorangicin_SorH_3_KS220bimodbOH': 'Clade_31', 'thailandamide_TaiK_2_KS80bOH': 'Clade_31', 'tolytoxin_TtoE_8_KS140bimodbDOH': 'Clade_31', 'difficidin_DifJ_1_KS11zDBzDB': 'Clade_65', 'elansolid_Csan_ElaP_1KS8eDB': 'Clade_65', 'elansolid_Cpin_ElsO_1KS8eDB': 'Clade_65', 'kalimantacin_batumin_Bat3_1KS8eDB': 'Clade_65', 'leinamycin_LnmJ_1_KS4eDB': 'Clade_65', 'oxazolomycin_OzmH_5_KS9eDB': 'Clade_65', 'oxazolomycin_OzmN_3_KS4zDB': 'Clade_65', 'thailandamide_TaiL_1_KS9eDB': 'Clade_65', 'SIA7248_SiaH_KS11_eDB': 'Clade_65', 'FR901464_Fr9C_2_KS20bOH': 'Clade_80', 'thailanstatin_TstC_2_KS20bOH': 'Clade_80', 'bongkrekic_acid_BonD_3KS120vinylbranch': 'Clade_76', 'sorangicin_SorI_2_KS240zDB': 'Clade_76', 'chivosazole_ChiC_4_KS7eDB': 'Clade_122', 'lankacidin_LkcC_1_KS2aMeeDB': 'Clade_122', 'leinamycin_LnmJ_3_KS6aMeDB': 'Clade_122', '9-methylstreptimidone_SmdI_KS5_5aDMebketo': 'Clade_21', 'FR901464_Fr9F_2_KS5redaLMe': 'Clade_21', 'cycloheximide_ChxE_5_KS5aDMebketo': 'Clade_21', 'dorrigocin_migrastatin_MgsF_2KS5aDMebketodH': 'Clade_21', 'dorrigocin_migrastatin_MgsF_5KS8bLOH': 'Clade_21', 'thailanstatin_TstDEF_2_KS5redaLMe': 'Clade_21', 'calyculin_CalB_3_KS50redaLMe': 'Clade_21', 'griseoviridin_SgvE1_2_KS2bDOH': 'Clade_53', 'griseoviridin_SgvE3_2_KS6bLOH': 'Clade_53', 'macrolactin_MlnB_2_KS2bDOH': 'Clade_53', 'virginiamycin_VirA_2_KS2aLMebDOH': 'Clade_53', 'virginiamycin_VirG_1_KS6bDOH': 'Clade_53', 'chlorotonil_CtoC_2_KS2bOH': 'Clade_53', 'anthracimycin_AtcD_2_KS2bOH': 'Clade_53', 'luminaolid_LumA_2_KS2aDMeshDB': 'Clade_43', 'tolytoxin_TtoC_2_KS2aDMeshDB': 'Clade_43'}