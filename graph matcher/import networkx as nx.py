import networkx as nx

data={"data":[{"step":"#0","score":"0.82","product":"C1C=C(C)C(NC(=O)CN(CC)CC)=C(C)C=1","reactant":"Cc1cccc(C)c1NC(=O)CCl.CCNCC","condition":"Cc1ccccc1,[K+].[I-],[Cu],,,0.000\n,,[Cu],,,0.008\nCc1ccccc1,,[Cu],,,0.006","react":"C1C=C(C)C(NC(=O)CN(CC)CC)=C(C)C=1>>Cc1cccc(C)c1NC(=O)CCl.CCNCC","templete":"([#7:3]-[C:2](=[O;D1;H0:4])-[CH2;D2;+0:1]-[N;H0;D3;+0:6](-[C:5])-[C:7])>>Cl-[CH2;D2;+0:1]-[C:2](-[#7:3])=[O;D1;H0:4].[C:5]-[NH;D2;+0:6]-[C:7]"},{"step":"#0-#0","score":"0.97","product":"Cc1cccc(C)c1NC(=O)CCl","reactant":"Cc1cccc(C)c1N.O=C(Cl)CCl","condition":"Cc1ccccc1,,c1ccncc1,,,0.008\nCc1ccccc1,O=C([O-])[O-].[K+],c1ccncc1,,,0.000\nCc1ccccc1,CCN(CC)CC,c1ccncc1,,,0.000","react":"Cc1cccc(C)c1NC(=O)CCl>>Cc1cccc(C)c1N.O=C(Cl)CCl","templete":"([C:2]-[C;H0;D3;+0:1](=[O;D1;H0:3])-[NH;D2;+0:4]-[c:5])>>Cl-[C;H0;D3;+0:1](-[C:2])=[O;D1;H0:3].[NH2;D1;+0:4]-[c:5]"}],"additionalText":"AI page is opened"}
steps=data[0]




# 创建图 G 并添加节点及边
G = nx.Graph()

# 添加节点及其属性
G.add_node('A', attributes={'name': 'Node A', 'type': 'source'})
G.add_node('B', attributes={'name': 'Node B', 'type': 'intermediate'})
G.add_node('C', attributes={'name': 'Node C', 'type': 'intermediate'})
G.add_node('D', attributes={'name': 'Node D', 'type': 'intermediate'})
G.add_node('E', attributes={'name': 'Node E', 'type': 'sink'})
G.add_node('F', attributes={'name': 'Node F', 'type': 'sink'})

# 添加边
G.add_edges_from([
    ('A', 'B'), ('A', 'C'), ('B', 'D'), 
    ('C', 'D'), ('D', 'E'), ('E', 'F')
])

# 创建子图 H 并添加节点及边
H = nx.Graph()
H.add_node('X', attributes={'name': 'Sub Node X', 'type': 'source'})
H.add_node('Y', attributes={'name': 'Sub Node Y', 'type': 'sink'})
H.add_node('Z', attributes={'name': 'Sub Node Z', 'type': 'intermediate'})

# 添加边
H.add_edges_from([
    ('X', 'Y'), ('X', 'Z')
])

# 使用 networkx 的 isomorphism 模块查找同构
from networkx.algorithms import isomorphism

# 创建一个 VF2 子图同构实例
matcher = isomorphism.GraphMatcher(G, H)

# 查找并输出同构结果
if matcher.subgraph_is_isomorphic():
    print("Found subgraph isomorphism")
    for mapping in matcher.subgraph_isomorphisms_iter():
        print("Mapping:", mapping)
else:
    print("No subgraph isomorphism found.")
