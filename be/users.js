const users = [];

const all = () => {
    return users;
}

const store = ({ id, name, room }) => {

    // let id = users.length + 1;
    name = name.trim();
    room = room.trim();

    // let error;
    const userIsExits = users.find(user => user.name === name && user.room === room);
    if (!userIsExits) { 
        const user = {id, name, room};
        users.push(user);

        return {
            error: false,
            user,
        }
    } else {
        return { error: 'User has registered' }
    }
}

const destroy = ({ name, room }) => {

    const index = users.findIndex(user => user.room === room && user.name === name);
    if (index !== -1) return users.splice(index, 1)[0];
}

const find = (id) => {
    const user = users.find(user => user.id === id);
    return user;
}

module.exports = {all, store, destroy, find}