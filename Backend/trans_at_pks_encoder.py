import ast
from raichu.visualize_cluster import *
clade_to_tailoring_reactions={'Clade_126': ['AH'], 'Clade_77': ['AH', ' KR'], 'Clade_58': ['ALMT', ' KR_A1 '], 'Clade_103': ['AMT'], 'Clade_128': ['KR'], 'Clade_109': ['AMT', ' KR', 'DH', 'ER'], 'Clade_22': ['AMT', 'KR'], 'Clade_85': ['AMT', 'KR'], 'Clade_99': ['AMT', 'KR'], 'Clade_113': ['AMT', 'KR'], 'Clade_100': ['AMT', 'KR_B1'], 'Clade_80': ['AMT', 'KR_B1'], 'Clade_47': ['AMT', 'KR', ' EDH'], 'Clade_48': ['AMT', 'KR', ' EDH'], 'Clade_72': ['AMT', 'KR', 'EDH'], 'Clade_87': ['BMT'], 'Clade_3': ['DH'], 'Clade_4': ['DH'], 'Clade_34': ['KR'], 'Clade_36': ['KR'], 'Clade_49': ['KR'], 'Clade_60': ['KR', 'DH'], 'Clade_53': ['KR'], 'Clade_98': ['KR'], 'Clade_52': ['KR'], 'Clade_59': ['KR'], 'Clade_50': ['KR'], 'Clade_51': ['KR'], 'Clade_117': ['KR'], 'Clade_124': ['KR_A1'], 'Clade_122': ['KR_A1'], 'Clade_115': ['KR_A1'], 'Clade_111': ['KR_A1'], 'Clade_112': ['KR_A1'], 'Clade_119': ['KR_A1'], 'Clade_81': ['KR_A1', ' OMT '], 'Clade_79': ['KR_B1'], 'Clade_78': ['KR_B1'], 'Clade_56': ['KR_B1'], 'Clade_116': ['KR_B1'], 'Clade_93': ['KR', ' DH', 'ER', 'AMT'], 'Clade_5': ['KR', ' GDH'], 'Clade_106': ['KR', ' GDH'], 'Clade_12': ['KR', ' GDH'], 'Clade_105': ['KR', ' GDH'], 'Clade_90': ['KR', ' GDH', 'AMT'], 'Clade_83': ['KR', ' OMT'], 'Clade_61': ['KR', 'DH'], 'Clade_74': ['KR', 'DH'], 'Clade_55': ['KR', 'DH'], 'Clade_86': ['KR', 'DH'], 'Clade_42': ['KR', 'DH'], 'Clade_65': ['KR', 'DH'], 'Clade_68': ['KR', 'DH'], 'Clade_66': ['KR', 'DH'], 'Clade_101': ['KR', 'DH', ' BMT'], 'Clade_102': ['KR', 'DH', ' BMT'], 'Clade_97': ['KR', 'DH', ' BMT'], 'Clade_38': ['KR', 'DH', 'ER'], 'Clade_107': ['KR', 'EDH'], 'Clade_31': ['KR', 'EDH'], 'Clade_62': ['KR', 'EDH'], 'Clade_57': ['KR', 'EDH'], 'Clade_64': ['KR', 'EDH'], 'Clade_70': ['KR', 'EDH'], 'Clade_63': ['KR', 'EDH'], 'Clade_82': ['KR', 'EDH', ' BMT'], 'Clade_110': ['KR', 'ZDH'], 'Clade_43': ['KR', 'ZDH'], 'Clade_69': ['KR', 'ZDH'], 'Clade_84': ['KR', 'ZGDH', ' AMT '], 'Clade_108': ['SC'], 'Clade_123': ['SC'], 'Clade_23': ['SC'], 'Clade_26': ['SC']}
clade_to_elongating={'Clade_33': 'non-elongating', 'Clade_73': 'non-elongating', 'Clade_128': 'elongating', 'Clade_109': 'non-elongating', 'Clade_72': 'non-elongating', 'Clade_61': 'non-elongating', 'Clade_74': 'non-elongating', 'Clade_55': 'non-elongating', 'Clade_86': 'non-elongating', 'Clade_75': 'non-elongating', 'Clade_108': 'non-elongating', 'Clade_110': 'non-elongating', 'Clade_79': 'non-elongating', 'Clade_3': 'non-elongating', 'Clade_4': 'non-elongating', 'Clade_34': 'non-elongating', 'Clade_36': 'non-elongating', 'Clade_49': 'non-elongating', 'Clade_60': 'non-elongating', 'Clade_30': 'elongating', 'Clade_1': 'elongating', 'Clade_2': 'elongating', 'Clade_121': 'elongating', 'Clade_41': 'elongating', 'Clade_8': 'elongating', 'Clade_10': 'elongating', 'Clade_125': 'elongating', 'Clade_126': 'elongating', 'Clade_103': 'elongating', 'Clade_99': 'elongating', 'Clade_93': 'elongating', 'Clade_90': 'elongating', 'Clade_47': 'elongating', 'Clade_48': 'elongating', 'Clade_22': 'elongating', 'Clade_84': 'elongating', 'Clade_58': 'elongating', 'Clade_100': 'elongating', 'Clade_80': 'elongating', 'Clade_85': 'elongating', 'Clade_113': 'elongating', 'Clade_77': 'elongating', 'Clade_53': 'elongating', 'Clade_39': 'elongating', 'Clade_42': 'elongating', 'Clade_65': 'elongating', 'Clade_68': 'elongating', 'Clade_66': 'elongating', 'Clade_107': 'elongating', 'Clade_31': 'elongating', 'Clade_62': 'elongating', 'Clade_57': 'elongating', 'Clade_64': 'elongating', 'Clade_70': 'elongating', 'Clade_63': 'elongating', 'Clade_71': 'elongating', 'Clade_89': 'elongating', 'Clade_127': 'elongating', 'Clade_45': 'elongating', 'Clade_19': 'elongating', 'Clade_67': 'elongating', 'Clade_114': 'elongating', 'Clade_120': 'elongating', 'Clade_40': 'elongating', 'Clade_44': 'elongating', 'Clade_11': 'elongating', 'Clade_123': 'elongating', 'Clade_23': 'elongating', 'Clade_38': 'elongating', 'Clade_26': 'elongating', 'Clade_12': 'elongating', 'Clade_105': 'elongating', 'Clade_5': 'elongating', 'Clade_106': 'elongating', 'Clade_6': 'elongating', 'Clade_7': 'elongating', 'Clade_104': 'elongating', 'Clade_92': 'elongating', 'Clade_119': 'elongating', 'Clade_43': 'elongating', 'Clade_69': 'elongating', 'Clade_59': 'elongating', 'Clade_124': 'elongating', 'Clade_122': 'elongating', 'Clade_115': 'elongating', 'Clade_111': 'elongating', 'Clade_112': 'elongating', 'Clade_81': 'elongating', 'Clade_83': 'elongating', 'Clade_78': 'elongating', 'Clade_56': 'elongating', 'Clade_116': 'elongating', 'Clade_87': 'elongating', 'Clade_101': 'elongating', 'Clade_102': 'elongating', 'Clade_97': 'elongating', 'Clade_82': 'elongating', 'Clade_50': 'elongating', 'Clade_51': 'elongating', 'Clade_117': 'elongating', 'Clade_98': 'elongating', 'Clade_52': 'elongating', 'Clade_29': 'elongating'}
clade_to_starter_substrate={'Clade_45':"C[C@@H](O)C(S)=O"}
example_cluster=  [['module_1', 'starter_module_trans_at_pks',"malonylcoa"],
                           ['module_2', 'elongation_module_trans_at_pks', 'Clade_45', ['KR_B2']],
                           ['module_3', 'elongation_module_trans_at_pks', 'Clade_116', ['KR_A1']],
                           ['module_4', 'elongation_module_NRPS', 'lysine', []],
                           ['module_5', 'elongation_module_trans_at_pks', 'Clade_36', ['KR', 'DH', 'ER']],
                           ['module_6', 'elongation_module_pks', 'CC(C(O)=O)C(S)=O', ['KR_A1']],
                           ['module_7', 'terminator_module_trans_at_pks', 'Clade_60', ['KR_A1']]]
example_cluster=  [['module_1', 'starter_module_trans_at_pks',"malonylcoa"],
                           ['module_2', 'elongation_module_trans_at_pks', 'Clade_45', ['KR_B2']],
                           ['module_3', 'elongation_module_trans_at_pks', 'Clade_116', ['KR_A1']],
                           ['module_4', 'elongation_module_NRPS', 'lysine', []],
                           ['module_5', 'elongation_module_trans_at_pks', 'Clade_36', ['KR', 'DH', 'ER']],
                           ['module_6', 'elongation_module_pks', 'methoxymalonylacp', ['KR_A1']],
                           ['module_7', 'terminator_module_trans_at_pks', 'Clade_60', ['KR_A1']]]
def translate_trans_at_pks_cluster_to_cis_at_pks(trans_at_pks_cluster):
    cis_at_pks_cluster=[]
    for index, trans_at_module in enumerate(trans_at_pks_cluster):
        cis_at_module=[]
        if index<len(trans_at_pks_cluster)-1:
            next_trans_at_module=trans_at_pks_cluster[index+1]
            if trans_at_module[1]=="starter_module_trans_at_pks" and next_trans_at_module[1]=="elongation_module_trans_at_pks":
                try:
                    cis_at_module=[trans_at_module[0],"starter_module_pks",clade_to_starter_substrate[next_trans_at_module[2]]]
                except:
                        cis_at_module=[trans_at_module[0],"starter_module_pks","OC(=O)CC(S)=O"]
                # try:
                #     cis_at_module=[trans_at_module[0],"starter_module_pks",clade_to_starter_substrate[next_trans_at_module[2]],[]]
                # except:
                #     try:
                #         cis_at_module=[trans_at_module[0],"starter_module_pks","OC(=O)CC(S)=O",clade_to_tailoring_reactions[next_trans_at_module[2]]]
                #     except:
                #         cis_at_module=[trans_at_module[0],"starter_module_pks","OC(=O)CC(S)=O",[]]
            elif trans_at_module[1]=="starter_module_trans_at_pks" and not next_trans_at_module[1]=="elongation_module_trans_at_pks":
                cis_at_module=[trans_at_module[0],"starter_module_pks","OC(=O)CC(S)=O"]
            elif trans_at_module[1]=="elongation_module_trans_at_pks" and next_trans_at_module[1]=="elongation_module_trans_at_pks":
                cis_at_module=[trans_at_module[0],"elongation_module_pks","OC(=O)CC(S)=O",clade_to_tailoring_reactions[next_trans_at_module[2]],clade_to_elongating[trans_at_module[2]]]
            elif trans_at_module[1]=="elongation_module_trans_at_pks" and not next_trans_at_module[1]=="elongation_module_trans_at_pks":
                cis_at_module=[trans_at_module[0],"elongation_module_pks","OC(=O)CC(S)=O",trans_at_module[3],clade_to_elongating[trans_at_module[2]]]
            else:
                cis_at_module=trans_at_module+["elongating"]
        else:
            if trans_at_module[1]=="terminator_module_trans_at_pks":
                cis_at_module=[trans_at_module[0],"terminator_module_pks","OC(=O)CC(S)=O",trans_at_module[3],clade_to_tailoring_reactions[trans_at_module[2]],"elongating"]
            elif trans_at_module[1]=="elongation_module_trans_at_pks":
                cis_at_module=[trans_at_module[0],"elongation_module_pks","OC(=O)CC(S)=O",trans_at_module[3],clade_to_tailoring_reactions[trans_at_module[2]],"elongating"]
            else:
                cis_at_module=trans_at_module+["elongating"]
        cis_at_pks_cluster+=[cis_at_module]
    return cis_at_pks_cluster
if __name__ == "__main__":
    cis_at_pks_cluster=translate_trans_at_pks_cluster_to_cis_at_pks(example_cluster)
    cis_at_pks_cluster=ast.literal_eval(str(cis_at_pks_cluster).replace("OC(=O)CC(S)=O","malonylcoa"))
    print(cis_at_pks_cluster)
    draw_cluster(cis_at_pks_cluster)
