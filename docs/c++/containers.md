# Vector

1️⃣ 构造函数（Construction）

| 构造方式                                  | 说明           | 示例                                                     |
| ------------------------------------- | ------------ | ------------------------------------------------------ |
| `vector()`                            | 默认构造空 vector | `std::vector<int> v;`                                  |
| `vector(size_t n)`                    | 构造 n 个默认值元素  | `std::vector<int> v(5); // 5 个 0`                      |
| `vector(size_t n, const T& value)`    | 构造 n 个指定值元素  | `std::vector<int> v(5, 42); // 5 个 42`                 |
| `vector(InputIt first, InputIt last)` | 区间构造         | `int arr[] = {1,2,3}; std::vector<int> v(arr, arr+3);` |
| `vector(const vector& other)`         | 拷贝构造         | `std::vector<int> v2(v1);`                             |
| `vector(vector&& other)`              | 移动构造         | `std::vector<int> v2(std::move(v1));`                  |
| `vector(std::initializer_list<T>)`    | 列表初始化        | `std::vector<int> v{1,2,3};`                           |

2️⃣ 访问元素（Element access）

| 函数          | 说明          | 示例                   |
| ----------- | ----------- | -------------------- |
| `v[i]`      | 下标访问（无边界检查） | `v[0]`               |
| `v.at(i)`   | 下标访问（有边界检查） | `v.at(0)`            |
| `v.front()` | 第一个元素       | `v.front()`          |
| `v.back()`  | 最后一个元素      | `v.back()`           |
| `v.data()`  | 返回指向底层数组指针  | `int* p = v.data();` |

3️⃣ 容量（Capacity）

| 函数                  | 说明               |
| ------------------- | ---------------- |
| `v.size()`          | 当前元素个数           |
| `v.max_size()`      | 可容纳最大元素数         |
| `v.empty()`         | 是否为空             |
| `v.reserve(n)`      | 预分配至少 n 个元素的空间   |
| `v.capacity()`      | 当前分配的容量          |
| `v.shrink_to_fit()` | 收缩容量以匹配当前大小（非强制） |

4️⃣ 修改内容（Modifiers）

| 函数                           | 说明        | 示例                                 |
| ---------------------------- | --------- | ---------------------------------- |
| `v.push_back(val)`           | 尾部添加元素    | `v.push_back(10);`                 |
| `v.emplace_back(args...)`    | 尾部原地构造    | `v.emplace_back(1,2);`             |
| `v.pop_back()`               | 删除最后一个元素  | `v.pop_back();`                    |
| `v.insert(pos, val)`         | 插入元素      | `v.insert(v.begin()+1, 42);`       |
| `v.insert(pos, n, val)`      | 插入 n 个元素  | `v.insert(v.begin(), 3, 5);`       |
| `v.insert(pos, first, last)` | 插入区间      | `v.insert(v.begin(), arr, arr+3);` |
| `v.erase(pos)`               | 删除指定位置    | `v.erase(v.begin());`              |
| `v.erase(first, last)`       | 删除区间      | `v.erase(v.begin(), v.begin()+2);` |
| `v.clear()`                  | 清空 vector |                                    |
| `v.assign(n, val)`           | 赋值 n 个元素  |                                    |
| `v.assign(first, last)`      | 区间赋值      |                                    |
| `v.assign({1,2,3})`          | 列表赋值      |                                    |

5️⃣ 迭代器（Iterators）

| 函数                          | 说明          |
| --------------------------- | ----------- |
| `v.begin()` / `v.end()`     | 正向迭代器       |
| `v.cbegin()` / `v.cend()`   | const 正向迭代器 |
| `v.rbegin()` / `v.rend()`   | 反向迭代器       |
| `v.crbegin()` / `v.crend()` | const 反向迭代器 |


示例：
```
for(auto it = v.begin(); it != v.end(); ++it) {
    std::cout << *it << " ";
}
for(auto& x : v) { std::cout << x << " "; }
```
6️⃣ C++11/14/17 特性

| 函数                       | 说明                        |
| ------------------------ | ------------------------- |
| `emplace(pos, args...)`  | 原地构造元素                    |
| `std::move` / `vector&&` | 移动语义支持                    |
| `std::vector::data()`    | C++11 允许获取原始数组指针          |
| 列表初始化 `{}`               | 支持 `vector<int> v{1,2,3}` |

7️⃣ 常用算法配合

排序：
```
#include <algorithm>
std::sort(v.begin(), v.end());
```

查找：
```
auto it = std::find(v.begin(), v.end(), 10);
```

累加：
```
#include <numeric>
int sum = std::accumulate(v.begin(), v.end(), 0);
```
8️⃣ 总结

- std::vector 是动态数组，自动扩容
- 核心功能：访问元素、修改元素、容量管理、迭代器遍历
- 高级用法：emplace、移动语义、算法配合