import api from "@/store/api"
import utils from '@/utils'

function userInRole(user, role) {
    if(user && role) {
        if(user.IsAdmin) return true;
        if(user.Roles) {
            if(user.Roles.find(r => r.Id == role)) return true;
            if(user.Roles.find(r => r.Name && r.Name == role)) return true;
        }
    }
    return false;
}

function userIsAllowedAction(user, action) {
    if(user && action) {
        if(user.IsAdmin) return true;
        if(action.Roles) {
            for(let r in action.Roles) {
                const role = action.Roles[r].Id;
                if(userInRole(user, role)) return true;
            }
        }
    }
    return false;
}

export default {
    name: 'system',
    actions: {
        async loadSystem({commit}) {
            await api.loadObject(
                "GetSystem",
                "/system",
                commit,
                "setSystem"
            );
        },
        
        async loadCurrentUser({commit}) {
            await api.loadObject(
                "GetCurrentUser",
                "/system/current-user",
                commit,
                "setCurrentUser"
            );
        },
        async loadRoles({commit}) {
            await api.loadObjects(
                "GetRoles",
                "/system/roles",
                commit,
                "setRoles"
            );
        },
        async loadActions({commit}) {
            await api.loadObjects(
                "GetActions",
                "/system/actions",
                commit,
                "setActions"
            );
        },
        async updateActionRoles({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateActionRoles",
                "/system/update-action-roles",
                getters.getActionById(key),
                values,
                commit,
                "setAction"
            );
        },
        async loadUsers({commit}) {
            await api.loadObjects(
                "GetUsers",
                "/sapsan/users",
                commit,
                "setUsers"
            );
        },
        
    },
    mutations: {
        setSystem(state, system) {
            state.system = system;
        },
        setCurrentUser(state, currentUser) {
            state.currentUser = currentUser;
        },
        setUsers(state, users) {
            state.users = users;
            state.allUsers = true;
        },
        addUsers(state, users) {
            for(let i in users) {
                const user = users[i];
                if(state.users.find(u => u.Id == user.Id)) {
                    utils.setItem(state.users, user);
                }
                else {
                    state.users.push(user);
                }
            }
        },
        addUser(state, user) {
            state.users.push(user);
        },
        setUser(state, user) {
            utils.setItem(state.users, user);
        },
        removeUser(state, user) {
            state.users = utils.getItemsRemoveItem(state.users, user);
        },
        setRoles(state, roles) {
            state.roles = roles;
        },
        setRole(state, role) {
            utils.setItem(state.roles, role);
        },
        addRole(state, role) {
            state.roles.push(role);
        },
        removeRole(state, role) {
            state.roles = utils.getItemsRemoveItem(state.roles, role);
        },
        setActions(state, actions) {
            state.actions = actions;
        },
        setAction(state, action) {
            utils.setItem(state.actions, action);
        }
    },
    state: {
        system: null,
        currentUser: null,
        allUsers: false,
        users: [],
        roles: [],
        actions: []
    },
    getters:{
        getSystem: (state) => {
            return state.system;
        },
        allUsersIsLoaded: (state) => {
            return state.allUsers;
        },
        currentUserIsLoaded: (state) => {
            return state.currentUser != null;
        },
        currentUserIsAuthorized: (state) => {
            return state.currentUser != null && state.currentUser.Roles != null && state.currentUser.Roles.length > 0;
        },
        currentUserInRole: (state) => (role) => {
            if(role) {
                if(role instanceof Array) {
                    for(let i in role) {
                        if(userInRole(state.currentUser, role[i])) {
                            return true;
                        }
                    }
                }
                else {
                    return userInRole(state.currentUser, role);
                }
            }
            return false;
        },
        currentUserIsAllowedAction: (state) => (actionName) => {
            const action = state.actions.find(a => a.Name == actionName);
            return userIsAllowedAction(state.currentUser, action);
        },
        getCurrentUser: (state) => {
            return state.currentUser;
        },
        getUsers: (state) => {
            return state.users;
        },
        getUsersByRole: (state) => (roleName) => {
            const users = state.users.filter(u => u.Roles && u.Roles.find(r => r.Name && r.Name == roleName));
            return users;
        },
        getUsersByRoleId: (state) => (roleId) => {
            const users = state.users.filter(u => u.Roles && u.Roles.find(r => r.Id == roleId));
            return users;
        },
        getUserById: (state) => (Id) => {
            return state.users.find(u => u.Id == Id);
        },
        getUserByName: (state) => (Name) => {
            return state.users.find(u => u.Name.toLowerCase() == Name.toLowerCase());
        },
        getUserRoles: (state) => (userId) => {
            const user = state.users.find(u => u.Id == userId);
            if(user && user.Roles) {
                return user.Roles;
            }
            return [];
        },
        getRoles: (state) => {
            return state.roles;
        },
        getRoleById: (state) => (Id) => {
            return state.roles.find(r => r.Id == Id);
        },
        actionsIsLoaded: (state) => {
            return state.actions && state.actions.length > 0;
        },
        getActions: (state) => {
            return state.actions;
        },
        getActionById: (state) => (Id) => {
            return state.actions.find(a => a.Id == Id);
        },
        getActionByName: (state) => (Name) => {
            return state.actions.find(a => a.Name === Name);
        },
        getActionRoles: (state) => (actionId) => {
            const action = state.actions.find(a => a.Id == actionId);
            if(action && action.Roles) {
                return action.Roles;
            }
            return [];
        }
    }
}
