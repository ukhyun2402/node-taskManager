require('../src/db/mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

// 5f20ce94fa4e5e6300f0c03f

// User.findByIdAndUpdate({_id:'5f20ce94fa4e5e6300f0c03f'}, { age : 1}).then((user) => {
//     console.log(user);
//     return User.countDocuments({age: 1})
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// });

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, {age} );
//     const count = await User.countDocuments({age});

//     return count;
// }

// updateAgeAndCount('5f20ce94fa4e5e6300f0c03f',2).then((count) => {
//     console.log(count);
// }).catch((e) => {
//     console.log(e);
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete({id});
    const count = await User.countDocuments({completed: false});
    console.log(count);
    return count;
}
deleteTaskAndCount('5f20ce94fa4e5e6300f0c03f');