const fs = require('fs');

const projectFolderPath = '/Technical/Projects/Node/jwt-auth';
const userDBFolderName = '/DB/users';
const userDBFolderPath = projectFolderPath + userDBFolderName;

const usersFileName = '/users.txt';
const userDBFilePath = userDBFolderPath + usersFileName;

const dbInit = () => {
    try {
        if (!fs.existsSync(userDBFolderPath)) {
            console.log('Creating DB Folder');
            fs.mkdirSync(userDBFolderPath, { recursive: true });
        }
    } catch (error) {
        console.error('Error While Creating DB', error);
    }
};

const addUsers = (users) => {
    const existingUsers = getAllUsers();
    const usersToAdd = [...(existingUsers ?? []), ...users];
    try { 
        if(usersToAdd && usersToAdd.length) {
            fs.writeFileSync(userDBFilePath, JSON.stringify({ users: usersToAdd }));    
        }
    } catch (error) {
        console.error('Error While Adding Users', error);
    }
}

const getAllUsers = () => {
    try {
        const usersJSON = fs.readFileSync(userDBFilePath, 'utf8');
        if(!usersJSON) return;
        const usersData  = JSON.parse(usersJSON);
        return usersData?.users;
      } catch (error) {
        console.error('Error while Reading All Users', error);
      }
}

dbInit();
  
module.exports = {
    addUsers,
    getAllUsers
};