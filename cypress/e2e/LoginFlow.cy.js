describe('The Typing Flow should work correctly', function(){
    it('Should be able to type', () => {
        // visit the typing area and start typing
        cy.visit('/')
        cy.get('[data-qa-id="typing-textarea"]').should('exist');

        cy.get('[data-qa-id="typing-textarea"]').click()

        cy.get('[data-qa-id="stringToType"]').invoke('html').then((value) => {
            cy.get('[data-qa-id="typing-textarea"]').type(value)
        })

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000)

        cy.get('[data-qa-id="typing-result-container"]').should('exist')

        cy.get('[data-qa-id="not-login-banner"]').click()

        // since you have not logged in it will redirect you to login page
        cy.get('[data-qa-id="login-tab"]').click()
        cy.get('[data-qa-id="enter-user-name"]').find('input').eq(1).type('test66', { force: true })
        cy.get('[data-qa-id="enter-password"]').find('input').eq(1).type('test66', { force: true })
        cy.get('[data-qa-id="re-enter-password"]').find('input').eq(1).type('test66', { force: true })

        cy.get('[data-qa-id="action-button"]').click({ multiple: true, force: true })

        cy.intercept('https://canarytype-alpha3.azurewebsites.net/api/Login').as('loginrequest')
        cy.wait('@loginrequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
        })
    })
})