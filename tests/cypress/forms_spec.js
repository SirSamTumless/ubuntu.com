/// <reference types="cypress" />

// Those functions come from https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
const getIframeDocument = () => {
  return cy
    .get(".g-recaptcha iframe")
    .its("0.contentDocument")
    .should("exist");
};

const getIframeBody = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};

context("Marketo form", () => {
  beforeEach(() => {
    cy.server();
    cy.route(
      "POST",
      "https://app-sjg.marketo.com/index.php/leadCapture/save2"
    ).as("captureLead");
  });

  afterEach(() => {
    cy.wait("@captureLead").should(xhr => {
      expect(xhr.method).to.equal("POST");
      expect(xhr.status).to.equal(200);
    });
  });

  it("/download/server/thank-you", () => {
    cy.visit("/download/server/thank-you");

    cy.get('input[name="FirstName"]').type("Test");
    cy.get('input[name="LastName"]').type("Test");
    cy.get('input[name="Company"]').type("Test");
    cy.get('input[name="Title"]').type("Test");
    cy.get('input[name="Email"]').type("test@test.com");

    getIframeBody()
      .find(".rc-anchor-content")
      .click();

    cy.wait(10000); // eslint-disable-line
    cy.get("#mktoForm_3485").submit();
  });

  it("/core/contact-us", () => {
    cy.visit("/core/contact-us");

    cy.get('input[name="FirstName"]').type("Test");
    cy.get('input[name="LastName"]').type("Test");
    cy.get('input[name="Email"]').type("test@test.com");
    cy.get('input[name="Phone"]').type("000000000");
    cy.get('select[name="Country"]').select("Colombia");
    cy.get('input[name="Company"]').type("Test");
    cy.get('input[name="Title"]').type("Test");
    cy.get('textarea[name="Comments_from_lead__c"]').type(
      "Test test test test"
    );
    cy.get('label[for="canonicalUpdatesOptIn"]').click();

    getIframeBody()
      .find(".rc-anchor-content")
      .click();

    cy.wait(10000); // eslint-disable-line
    cy.get("#mktoForm_1266").submit();
  });

  it("/engage/anbox-cloud-gaming-whitepaper", () => {
    cy.visit("/engage/anbox-cloud-gaming-whitepaper");

    cy.get('input[name="FirstName"]').type("Test");
    cy.get('input[name="LastName"]').type("Test");
    cy.get('input[name="Company"]').type("Test");
    cy.get('input[name="Title"]').type("Test");
    cy.get('input[name="Email"]').type("test@test.com");
    cy.get('input[name="Phone"]').type("000000000");

    getIframeBody()
      .find(".rc-anchor-content")
      .click();

    cy.wait(10000); // eslint-disable-line
    cy.get("#mktoForm_3494").submit();
  });
});

context("Marketo dynamic form", () => {
  it("/openstack#get-in-touch", () => {
    cy.visit("/openstack#get-in-touch");

    cy.get(".js-pagination--1 .pagination__link--next").click();
    cy.get(".js-pagination--2 .pagination__link--next").click();

    cy.get('input[name="FirstName"]').type("Test");
    cy.get('input[name="LastName"]').type("Test");
    cy.get('input[name="Email"]').type("test@test.com");
    cy.get('label[for="canonicalUpdatesOptIn"]').click();

    getIframeBody()
      .find(".rc-anchor-content")
      .click();

    cy.wait(10000); // eslint-disable-line
    cy.get("#mktoForm_1251")
      .submit()
      .should(page => {
        expect(page[0].action).to.equal(
          "https://pages.ubuntu.com/index.php/leadCapture/save"
        );
      });
  });
});
