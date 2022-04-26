"""
This script contains examples of the general functionalities of RAIChU.
"""
from visualize_cluster import *
from pikachu.general import *

if __name__ == "__main__":

    #Calculate structure directly from input PKS cluster
    pks_cluster = [['module_1', 'starter_module_pks', 'SC(=O)CC'],
                           ['module_2', 'elongation_module_pks', 'methylmalonylcoa', ['KR_B2']],
                           ['module_3', 'elongation_module_pks', 'methylmalonylcoa', ['KR_A1']],
                           ['module_4', 'elongation_module_pks', 'methylmalonylcoa', ['KR_C2']],
                           ['module_5', 'elongation_module_pks', 'methylmalonylcoa', ['KR', 'DH', 'ER']],
                           ['module_6', 'elongation_module_pks', 'methylmalonylcoa', ['KR_A1']],
                           ['module_7', 'terminator_module_pks', 'methylmalonylcoa', ['KR_A1']]]
 
    global global_final_polyketide_Drawer_object


    # Save (don't show!) drawings of the chain intermediate per module
    list_drawings_per_module = cluster_to_structure(pks_cluster,
    attach_to_acp=True, draw_structures_per_module=True)



    # Close all matplotlib windows that were still open when generating
    # the chain intermediate Drawer objects
    plt.close('all')

  
    # Build list of all modules comprised in the cluster, used to draw
    # module/domain architecture later
    list_svgs=[]
    print (list_drawings_per_module)
    
    for drawing_list in list_drawings_per_module:
        for drawing in drawing_list:
            for atom in drawing.structure.graph:
                atom.draw.colour = 'black'
                if atom.annotations.domain_type:
                    atom.annotations.set_annotation('domain_type', ' ')
            print (drawing)
            drawing.show_molecule()
            list_svgs+=[[drawing.save_svg_string().replace("\n","").replace("\"","'")]]
                    
    print (list_svgs)
    #Visualise PKS cluster (interactive mode)

    #Visualise NRPS cluster
    nrps_cluster = [['NRPS module 1', 'starter_module_nrps', 'd-threonine'],
                    ['NRPS module 2', 'elongation_module_nrps', 'valine', []],
                    ['NRPS module 3', 'elongation_module_nrps', 'serine', ['E', 'nMT']],
                    ['NRPS module 4', 'elongation_module_nrps', 'cysteine', ['E']],
                    ['NRPS module 5', 'elongation_module_nrps', 'glutamicacid', []],
                    ['NRPS module 6', 'elongation_module_nrps', 'alanine', ['E']],
                    ['NRPS module 7', 'terminator_module_nrps', 'valine', []]]
    #draw_cluster(nrps_cluster)

    #Visualise hybrid PKS/NRPS cluster
    hybrid =       [['PKS module 1', 'starter_module_pks', 'SC(=O)CC'],
                    ['NRPS module 2', 'elongation_module_nrps', 'valine', []],
                    ['NRPS module 3', 'elongation_module_nrps', 'serine', []],
                    ['PKS module 4', 'elongation_module_pks', 'malonylcoa', ['KR','DH']],
                    ['NRPS module 5', 'elongation_module_nrps', 'glutamicacid', ['E', 'nMT']],
                    ['PKS module 6', 'elongation_module_pks', 'methoxymalonylacp', ['KR','DH','ER']],
                    ['NRPS module 7', 'terminator_module_nrps', 'valine', []]]
   # draw_cluster(hybrid, interactive=True)
