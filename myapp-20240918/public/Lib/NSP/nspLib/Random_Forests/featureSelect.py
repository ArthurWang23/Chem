# from curses import termattrs
import pandas as pd
# （4）划分测试集和训练集
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier  # 导入随机森林
import numpy as np
import matplotlib.pyplot as plt

# （1）导入数据
# filepath = 'weather.xlsx'
# data = pd.read_excel(filepath,sheet_name='Sheet1')
# cols = data.columns.size
# rows = data.shape[0]
# print(data.iloc[1,1])

# filepath1 = 'ship_train.csv'
filepath1 = 'F:\\IDS2018\\Friday-02-03-2018_TrafficForML_CICFlowMeter.csv'
train = pd.read_csv(filepath1, low_memory=False)
# print(train)
filepath2 = 'F:\\IDS2018\\Wednesday-28-02-2018_TrafficForML_CICFlowMeter.csv'
test = pd.read_csv(filepath2, low_memory=False)

# 根据皮尔逊相关系数选择与要预测的属性列SalePrice相关性最高的10个属性
# [:11]，选出11个是因为Survived自己与自己的相关性最高，所以要将它去除故选择排序后的前11个属性，再去除SalePrice
features = train.corr()['LabelNum'].abs().sort_values(ascending=False)[0:11]
features.drop('LabelNum', axis=0, inplace=True)
features = features.index
print(features)

# 使用随机森林模型进行拟合的过程
X_train = train[features]
Y_train = train['LabelNum']

# 传入建模所需的特征值数据和目标值数据
x_train, x_test, y_train, y_test = train_test_split(X_train, Y_train, test_size=0.25)

print('x_train:', x_train.shape, 'x_test', x_test.shape)

# X_test = test[features]
# y_test = test['LabelNum']
# X_test = X_test[392400:392600]
# y_test = y_test[392400:392600]


data_predict_features = x_train[-10:]  # 输入预测函数的特征值
data_predict_targets = y_train[-10:]  # 验证预测结果的目标值
x_train = x_train[:-10]  # 建模所需的特征值x
y_train = y_train[:-10]  # 建模所需的目标值y

feat_labels = X_train.columns

rf = RandomForestClassifier(n_estimators=100, max_depth=None)
# from sklearn.pipeline import Pipeline #导入管道处理
# from sklearn.impute import SimpleImputer #导入插值函数
# from sklearn.preprocessing import StandardScaler #导入数组标准化函数
# rf_pipe = Pipeline([('imputer', SimpleImputer(strategy='median')), ('standardize', StandardScaler()), ('rf', rf)])
# rf_pipe.fit(x_train, y_train)
rf.fit(x_train, y_train)
accuracy = rf.score(x_test, y_test)
# result = rf_pipe.predict(data_predict_features)
result = rf.predict(data_predict_features)
print('accuracy:', accuracy)
print(result)
print(data_predict_targets)

# 根据随机森林模型的拟合结果选择特征
# rf = rf_pipe.__getitem__('rf')
importance = rf.feature_importances_

# np.argsort()返回待排序集合从下到大的索引值，[::-1]实现倒序，即最终imp_result内保存的是从大到小的索引值
imp_result = np.argsort(importance)[::-1][:10]  # np.argsort()将a中的元素从小到大排列，提取其在排列前对应的index(索引)输出

# 按重要性从高到低输出属性列名和其重要性
for i in range(len(imp_result)):
    print("%2d. %-*s %f" % (i + 1, 30, feat_labels[imp_result[i]], importance[imp_result[i]]))

# 对属性列，按属性重要性从高到低进行排序
feat_labels = [feat_labels[i] for i in imp_result]

# 绘制特征重要性图像
plt.title('Feature Importance')
plt.bar(range(len(imp_result)), importance[imp_result], color='lightblue', align='center')
plt.xticks(range(len(imp_result)), feat_labels, rotation=90)
plt.xlim([-1, len(imp_result)])
plt.tight_layout()
plt.show()

# import numpy as np
# from sklearn.datasets import load_iris
# iris=load_iris()

# result=[]
# 使用numpy计算数据特征和标签的相关系数
# for i in range(np.shape(iris.data)[1]):
# pccs = np.corrcoef(iris.data[:,i], iris.target)
# print(pccs)
# result.append(pccs[:,1][0])

# print(result)
# 对列表中的数都保留两位小数
# result1=[]
# for i in range(len(result)):
# result1.append(round(result[i],3))

# print(result1)
