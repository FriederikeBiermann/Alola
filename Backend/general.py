"""
This script contains examples of the general functionalities of RAIChU
"""
from visualize_pks_cluster import * #this script contains all import statements
#for the necessary functions

if __name__ == "__main__":
    #Simple elongation reaction. Input should be a PIKAChU Structure object of a
    #thioester.
    input_polyketide_intermediate = read_smiles('SC(CC)=O')
    Drawer(input_polyketide_intermediate)
    product = add_malonylunit(input_polyketide_intermediate)
    #Or: add_methylmalonylunit, add_ethylmalonylunit, add_methoxymalonylunit
    Drawer(product)

    #Simple tailoring reaction. Input should be polyketide intermediate just
    #after an elongation reaction
    product2 = ketoreductase(product)
    Drawer(product2)
    product3 = dehydratase(product2)
    Drawer(product3)
    product4 = enoylreductase(product3)
    Drawer(product4)


    #Calculate structure directly from input PKS cluster
    erythromycin_cluster = [['module_3_0', 'starter_module', 'CCC(S)=O'], ['module_3_1', 'elongation_module', 'methylmalonylcoa', ['KS', 'AT', 'KR_B2', 'PKS_PP']], ['module_3_2', 'elongation_module', 'methylmalonylcoa', ['KS', 'AT', 'KR_A1', 'PKS_PP']], ['module_4_0', 'elongation_module', 'methylmalonylcoa', ['KS', 'AT', 'ACP']], ['module_4_1', 'elongation_module', 'methylmalonylcoa', ['KS', 'AT', 'DH', 'ER', 'KR', 'ACP']], ['module_5_0', 'elongation_module', 'methylmalonylcoa', ['KS', 'AT', 'KR_A1', 'PKS_PP']], ['module_5_1', 'terminator_module', 'methylmalonylcoa', ['KS', 'AT', 'KR_A1', 'PKS_PP', 'TE']], ['module_7_0', 'terminator_module', 'malonylcoa', ['TE']]]
    final_product = pks_cluster_to_structure(erythromycin_cluster)
    print (final_product)
    #Visualise PKS cluster
    draw_pks_cluster(erythromycin_cluster)

    #Visualise PKS cluster (interactive mode)
    draw_pks_cluster(erythromycin_cluster, interactive=True)
