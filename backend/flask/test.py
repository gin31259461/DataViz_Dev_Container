from sklearn.datasets import load_iris

iris = load_iris()
print(iris.data, len(iris.data))
print(iris.target, len(iris.target))
print(iris.feature_names)
print(iris.target_names)
iris = load_iris(as_frame=True)
print(iris.frame)
