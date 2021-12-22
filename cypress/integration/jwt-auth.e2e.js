describe('Login Flow', () => {
    it('Going to Homepage without logging in', () => {
        cy.request({ 
            method: 'POST',
            url: 'http://localhost:1000/api/welcome',
            failOnStatusCode: false
        })
        .then(response => {
            expect(response.status).to.eq(403);
        });
    });

    it('Login User', () => {
        cy.request('POST', 'http://localhost:1000/api/login', { userName: 'user2', password: 'test@123' })
        .then(response => {
            expect(response.status).to.eq(200);
            expect(response).to.have.property('body');
            expect(response.body).to.have.property('userName', 'user2');
            expect(response.body).to.have.property('token');
        });
    });

    it('Going to Homepage after logging in', () => {
        cy.request('POST', 'http://localhost:1000/api/login', { userName: 'user2', password: 'test@123' })
        .then(response => {
            expect(response.status).to.eq(200);
            expect(response).to.have.property('body');
            expect(response.body).to.have.property('token');
            const token = response.body.token;     
        
            cy.request({ 
                method: 'POST',
                url: 'http://localhost:1000/api/welcome',
                failOnStatusCode: false,
                headers: {
                    'x-access-token': token 
                }
            })
            .then(response => {
                expect(response.status).to.eq(200);
                expect(response).to.have.property('body');
                expect(response.body).to.eq('Welcome!');
            });
        });        
    })
});

describe('Get User Flow', () => {
    it('Get User', () => {
        cy.request('http://localhost:1000/api/users/user1')
        .then(response => {
            expect(response).to.have.property('body');
            expect(response.body).to.have.length(1);
            expect(response.body[0]).to.have.property('userName', 'user1');
        });
    });

    it('Get Users', () => {
        cy.request('http://localhost:1000/api/users')
        .then(response => {
            expect(response).to.have.property('body');
            expect(response.body).to.have.length(2);
            expect(response.body[0]).to.have.property('userName', 'user1');
        });
    });
});