describe('Get User Flow', () => {
    it('Get User', () => {
        cy.request('http://localhost:1000/api/users/user1')
        .then(response => {
            expect(response).to.have.property('body');
            expect(response.body).to.have.length(1);
            expect(response.body[0]).to.have.property('userName', 'user1');
        });
    })
});