# Ant Design 表单布局与实用特性总结

## 1. 表单布局技巧

### 1.1 表单项换行方案

在 Ant Design 中，实现表单项换行有多种方式，主要分为以下几类：

#### ProForm 方案

ProForm 是 Ant Design Pro 中的高级表单组件，它提供了更便捷的布局方式：

```jsx
<ProForm grid={true}>
  <ProFormText
    name="field1"
    label="字段1"
    colProps={{
      span: 12,
    }}
  />
  <ProFormText
    name="field2"
    label="字段2"
    colProps={{
      span: 12,
    }}
  />
</ProForm>
```

特点：

- 开启 `grid={true}` 后可直接使用 `colProps` 控制布局
- 无需手动包裹 Row/Col 组件
- 支持响应式布局

#### 传统 Form 方案

使用 Ant Design 基础组件实现：

```jsx
<Form>
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="字段1" name="field1">
        <Input />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="字段2" name="field2">
        <Input />
      </Form.Item>
    </Col>
  </Row>
</Form>
```

### 1.2 标签与输入框布局

可以通过以下属性精确控制标签与输入框的布局：

```jsx
<ProFormText
  name="field"
  label="标签"
  colProps={{
    span: 12, // 控制整个表单项占据的列数
  }}
  formItemProps={{
    labelCol: { span: 8 }, // 控制标签宽度
    wrapperCol: { span: 16 }, // 控制输入框宽度
  }}
/>
```

## 2. ProComponents 其他实用特性

### 2.1 表单预设

ProForm 提供了多种预设布局：

```jsx
// 查询表单
<ProForm layout="queryFilter">
  {/* 自动折叠超出的表单项 */}
</ProForm>

// 左右结构
<ProForm layout="horizontal">
  {/* 默认左右结构 */}
</ProForm>

// 上下结构
<ProForm layout="vertical">
  {/* 标签在上，输入框在下 */}
</ProForm>
```

### 2.2 表单联动

ProFormDependency 实现表单项联动：

```jsx
<ProForm>
  <ProFormSelect name="city" options={[]} />
  <ProFormDependency name={["city"]}>
    {({ city }) => {
      return <ProFormSelect name="area" options={getAreasByCity(city)} />
    }}
  </ProFormDependency>
</ProForm>
```

### 2.3 表单验证

内置验证规则与自定义验证：

```jsx
<ProFormText
  name="phone"
  rules={[
    { required: true, message: "请输入手机号" },
    { pattern: /^1\d{10}$/, message: "手机号格式不正确" },
    {
      validator: async (_, value) => {
        if (!value || (await checkPhoneExists(value))) {
          return Promise.reject("手机号已存在")
        }
      },
    },
  ]}
/>
```

## 3. 实用技巧

### 3.1 表单初始化

```jsx
// 设置表单初始值
const [form] = Form.useForm()

useEffect(() => {
  form.setFieldsValue({
    field1: "value1",
    field2: "value2",
  })
}, [])
```

### 3.2 性能优化

- 使用 Form.Item 的 `noStyle` 属性减少 DOM 层级
- 合理使用 `shouldUpdate` 控制表单重渲染
- 大表单建议使用 Form.List 实现动态表单

### 3.3 常用配置

```jsx
<ProForm
  submitter={{
    // 自定义提交按钮
    render: (props, dom) => {
      return <FooterToolbar>{dom}</FooterToolbar>
    },
  }}
  onFinish={async (values) => {
    // 处理提交
  }}
  formRef={formRef} // 获取表单实例
  params={params} // 设置依赖参数
  request={async () => {
    // 远程获取表单数据
  }}
/>
```

## 4. 最佳实践

1. 表单布局选择：

   - 简单表单使用基础 Form
   - 复杂表单使用 ProForm
   - 查询表单使用 QueryFilter

2. 响应式设计：

   ```jsx
   colProps={{
     xs: 24,
     sm: 12,
     md: 8,
     lg: 6,
   }}
   ```

3. 表单验证：

   - 统一管理验证规则
   - 合理使用异步验证
   - 添加适当的提示信息

4. 状态管理：
   - 使用 Form.useForm 管理表单状态
   - 合理使用 Form.List 处理动态表单
   - 注意表单重置和清空时机

## 5. 常见问题解决方案

1. 表单重置：

   ```jsx
   form.resetFields() // 重置所有字段
   form.setFieldsValue({
     // 重置特定字段
     field1: undefined,
   })
   ```

2. 动态表单项：

   ```jsx
   <Form.List name="users">
     {(fields, { add, remove }) => (
       <>
         {fields.map((field) => (
           <Form.Item {...field}>
             <Input />
           </Form.Item>
         ))}
         <Button onClick={() => add()}>添加</Button>
       </>
     )}
   </Form.List>
   ```

3. 表单值监听：
   ```jsx
   <Form.Item noStyle shouldUpdate>
     {(form) => {
       const value = form.getFieldValue("field")
       return value ? <div>{value}</div> : null
     }}
   </Form.Item>
   ```

## 总结

Ant Design 和 Ant Design Pro 提供了强大的表单处理能力，通过合理使用这些特性，可以大大提高开发效率。在实际开发中，需要根据具体场景选择合适的方案，同时注意性能优化和用户体验。
