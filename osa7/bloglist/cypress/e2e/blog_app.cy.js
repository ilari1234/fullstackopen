describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.addUser({
      name: 'Test User',
      username: 'testUser1',
      password: 'supersecret'
    })
    cy.addUser({
      name: 'Test User 2',
      username: 'testUser2',
      password: 'supersecret'
    })

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Login to the system')
    cy.contains('Username')
    cy.contains('Password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testUser1')
      cy.get('#password').type('supersecret')
      cy.contains('login').click()
      cy.contains('Test User is logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testUser1')
      cy.get('#password').type('supersecre')
      cy.contains('login').click()
      cy.get('.error').should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Test User is logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testUser1', password: 'supersecret' })
    })

    it('A blog can be created', function () {
      cy.contains('Create new blog').click()
      cy.get('#title').type('Test blog title')
      cy.get('#author').type('Test blog author')
      cy.get('#url').type('http://www.testblogurl.com')
      cy.contains('Add blog').click()

      cy.get('.notification').should('contain', 'A new blog Test blog title added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.contains('Test blog title Test blog author')
    })

    describe('When blog exists', function () {
      beforeEach(function () {
        cy.addBlog({ title: 'Test blog title', author: 'Test blog author', url: 'http://www.testblogurl.com' })
      })
      it('A blog can be liked', function () {
        cy.contains('View').click()
        cy.get('#likes').should('contain', 'Likes: 0')
        cy.get('#likeButton').click()

        cy.get('.notification').should('contain', 'A blog Test blog title was liked')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
        cy.get('#likes').should('contain', 'Likes: 1')
      })

      it('A blog can be deleted', function () {
        cy.contains('View').click()
        cy.get('#deleteButton').click()
        cy.get('.notification').should('contain', 'Blog Test blog title was deleted')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
        cy.get('html').should('not.contain', 'Test blog title Test blog author')
      })

      it('Remove button is shown only to user who added the blog', function () {
        cy.contains('View').click()
        cy.get('#deleteButton').should('be.visible')

        cy.contains('Log out').click()
        cy.get('#username').type('testUser2')
        cy.get('#password').type('supersecret')
        cy.contains('login').click()

        cy.contains('View').click()
        cy.get('#deleteButton').should('not.be.visible')
      })

      it('Blogs are ordered by likes', function () {
        cy.addBlog({ title: 'Test blog title 2', author: 'Test blog author 2', url: 'http://www.testblogurl2.com' })
        cy.addBlog({ title: 'Test blog title 3', author: 'Test blog author 3', url: 'http://www.testblogurl3.com' })

        cy.contains('Test blog title Test blog author').find('button').contains('View').as('viewButton1')
        cy.contains('Test blog title 2 Test blog author 2').find('button').contains('View').as('viewButton2')
        cy.contains('Test blog title 3 Test blog author 3').find('button').contains('View').as('viewButton3')

        cy.contains('Test blog title Test blog author').parent().find('button').contains('Like').as('likeButton1')
        cy.contains('Test blog title 2 Test blog author 2').parent().find('button').contains('Like').as('likeButton2')
        cy.contains('Test blog title 3 Test blog author 3').parent().find('button').contains('Like').as('likeButton3')

        cy.get('@viewButton1').click()
        cy.get('@likeButton1').click()
        cy.get('#hideButton').click()

        cy.get('@viewButton2').click()
        cy.get('@likeButton2').click().click()
        cy.get('#hideButton').click()

        cy.get('@viewButton3').click()
        cy.get('@likeButton3').click().click().click()
        cy.get('#hideButton').click()

        cy.get('#blogShown').then(blogs => {
          cy.wrap(blogs[0]).contains('Test blog title 3')
          cy.wrap(blogs[1]).contains('Test blog title 2')
          cy.wrap(blogs[2]).contains('Test blog title')
        })
      })
    })
  })
})
