"""
This script contains examples of the general functionalities of RAIChU.
"""
from raichu.visualize_cluster import *


if __name__ == "__main__":

    #Calculate structure directly from input PKS cluster
    erythromycin_cluster = [['module_1', 'starter_module_pks', 'SC(=O)CC'],
                           ['module_2', 'elongation_module_pks', 'methylmalonylcoa', ['KR_B2']],
                           ['module_3', 'elongation_module_pks', 'methylmalonylcoa', ['KR_A1']],
                           ['module_4', 'elongation_module_pks', 'methylmalonylcoa', ['KR_C2']],
                           ['module_5', 'elongation_module_pks', 'methylmalonylcoa', ['KR', 'DH', 'ER']],
                           ['module_6', 'elongation_module_pks', 'methylmalonylcoa', ['KR_A1']],
                           ['module_7', 'terminator_module_pks', 'methylmalonylcoa', ['KR_A1']]]

    #draw_cluster(erythromycin_cluster)

    #Visualise PKS cluster (interactive mode)
    #draw_cluster(erythromycin_cluster, interactive=True)

    #Visualise NRPS cluster
    nrps_cluster = [['NRPS module 1', 'starter_module_nrps', 'd-threonine'],
                    ['NRPS module 2', 'elongation_module_nrps', 'valine', []],
                    ['NRPS module 3', 'elongation_module_nrps', 'serine', ['E', 'nMT']],
                    ['NRPS module 4', 'elongation_module_nrps', 'cysteine', ['E']],
                    ['NRPS module 5', 'elongation_module_nrps', 'glutamicacid', []],
                    ['NRPS module 6', 'elongation_module_nrps', 'alanine', ['E']],
                    ['NRPS module 7', 'terminator_module_nrps', 'leucine', [""]]]
    nrps_cluster=[["module_0_0","starter_module_nrps","glutamicacid"],["module_0_1","elongation_module_nrps","alanine",[]],["module_0_2","elongation_module_nrps","alanine",["E"]],["module_1_0","elongation_module_nrps","alanine",[]],["module_1_1","elongation_module_nrps","alanine",[]],["module_1_2","elongation_module_nrps","alanine",["E"]],["module_2_0","terminator_module_NRPS","leucine",[]]]




    #Visualise hybrid PKS/NRPS cluster
    hybrid1 =       [['PKS module 1', 'starter_module_pks', 'SC(=O)CC'],
                    ['NRPS module 2', 'elongation_module_nrps', 'valine', []],
                    ['NRPS module 3', 'elongation_module_nrps', 'phenylalanine', []],
                    ['PKS module 4', 'elongation_module_pks', 'malonylcoa', ['KR','DH']],
                    ['NRPS module 5', 'elongation_module_nrps', 'glutamicacid', ['E', 'nMT']],
                    ['PKS module 6', 'elongation_module_pks', 'methoxymalonylacp', ['KR','DH','ER']],
                    ['NRPS module 7', 'terminator_module_nrps', 'valine', [""]]]
    hybrid2 =       [['module 1', 'starter_module_pks', 'SC(=O)CC'],
                    ['module 2', 'elongation_module_nrps', 'valine', []],
                    ['module 3', 'elongation_module_nrps', 'alanine', []],
                    ['module 4', 'elongation_module_pks', 'malonylcoa', ['KR','DH']],
                    ['module 5', 'elongation_module_nrps', 'glutamicacid', ['E', 'nMT']],
                    ['module 6', 'elongation_module_pks', 'methoxymalonylacp', ['KR','DH','ER']],
                    [' module 7', 'terminator_module_nrps', 'valine', [""]]]
    hybrid3= [["module_3_0","starter_module_pks","CCC(S)=O"],["module_3_1","elongation_module_pks","methylmalonylcoa",["KR_B2",]],["module_3_2","elongation_module_pks","methylmalonylcoa",["KR_A1",]],["module_8_0","elongation_module_nrps","alanine",[]],["module_4_0","elongation_module_pks","methylmalonylcoa",[]],["module_4_1","elongation_module_pks","methylmalonylcoa",["KR","DH","ER"]],["module_5_0","elongation_module_pks","methylmalonylcoa",["KR_A1",]],["module_5_1","terminator_module_pks","methylmalonylcoa",["KR_A1",]]]
    intermediate=cluster_to_structure(hybrid3)
    #intermediate=attach_to_domain_nrp(intermediate, 'PCP')
    final_product = thioesterase_linear_product(intermediate)
    RaichuDrawer(final_product)
    #draw_cluster(hybrid, interactive=True)
