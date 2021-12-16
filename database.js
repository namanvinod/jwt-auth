const fs = require('fs');

const users = [
    {
        userName: 'admin',
        password: '',
        isActive: true
    },
    {
        userName: 'nv',
        password: '$2a$10$OygHHCU0gi2do.Pvti7/zuvAOMhaOFtIzL1fV0pmNvhFTSaQD.aym', //'test123',
        isActive: true
    },
    {
        userName: 'nvinod',
        password: '', //'test123',
        isActive: false
    }
];

const projectFolderPath = '/Technical/Projects/Node/jwt-auth';
const userDBFolderName = '/DB/users';
const userDBFolderPath = projectFolderPath + userDBFolderName;

const usersFileName = '/users.txt';
const userDBFilePath = userDBFolderPath + usersFileName;

const dbInit = () => {

    try {
        if (!fs.existsSync(userDBFolderPath)) {
            console.log('Creating new file');
            fs.mkdirSync(userDBFolderPath, { recursive: true });
        }

        if(users && users.length) {
            for(const user of users) {
                fs.writeFileSync(userDBFilePath, JSON.stringify(user) + '\n');    
            }    
        }
    } catch (error) {
        console.error('Error While DB Init', error);
    }
};

const addUsers = (users) => {
    try { 
        if(users && users.length) {
            for(const user of users) {
                fs.appendFileSync(userDBFilePath, JSON.stringify(user) + '\n');    
            }    
        }
    } catch (error) {
        console.error('Error While Adding Users', error);
    }
}

dbInit();
  
module.exports = {
    users,
    addUsers
};