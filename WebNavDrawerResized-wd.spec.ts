import { expect, assert } from 'chai';
import { Builder, By, until, WebDriver} from 'selenium-webdriver';
import ojwd, { DriverManager as dm }  from '@oracle/oraclejet-webdriver';
import {ojNavigationList, ojButton, ojWebElement} from '@oracle/oraclejet-webdriver/elements';

export async function openNavDrawer(driver:WebDriver) {

  let navDrawerBtn = await ojButton(
    driver,By.id('drawerToggleButton'));
  await navDrawerBtn.click();
};

export async function loadPageAndTestPageLoaded(driver:WebDriver, option:string) {

  // let appNavList = await ojNavigationList(driver,By.id('navDrawer'));
  let  navList = await ojNavigationList(driver, By.id('navDrawerList'));
  await navList.changeSelection(option);
  let compText = await navList.getProperty("selection");
  expect(compText).to.equal(option);
};

export async function notifyPageLoad(driver: WebDriver):Promise<string> {

  let announceElement = await ojWebElement(driver, By.id('ariaLiveMessage'));
  return new Promise<string>(resolve => {
    setTimeout(() => {
      announceElement.getDriver().executeScript(function() {
        return document.querySelector('#ariaLiveMessage').textContent;
      }).then(function(ariaLiveMessage:string) {
        resolve(ariaLiveMessage);
      });
    }, 2700);
  });
}

describe('Test Web NavDrawer Resize', function() {
  let driver: WebDriver;

  ['JET-Template-Web-NavDrawer', 'JET-Template-Web-NavDrawer-Typescript']
  .forEach(path => {
    describe(path, () => {
      //Called once
      before(async function() {
        driver = await dm.getDriver();
        await ojwd.get(driver, `@url@/built/apps/public_samples/${path}/public_html/index.html`);

        await driver.manage().window().setSize(700, 900);
        await openNavDrawer(driver);
      });

      //Called before each method
      beforeEach(async function() {

      });

      // Notify 'Incidents' page load
       it('can notify Incidents page load', async function() {
          let notificationMessage = 'Incidents page loaded.';
          await loadPageAndTestPageLoaded(driver, 'incidents');
          let pageLoadMessage:string = await notifyPageLoad(driver);
          expect(pageLoadMessage).to.equal(notificationMessage);
      });

      // Notify 'Dashboard' page load
      it('can notify Dashboard page load', async function() {
        let notificationMessage = 'Dashboard page loaded.';
        await loadPageAndTestPageLoaded(driver, 'dashboard');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

       // Notify 'Customers' page load
       it('can notify Customers page load', async function() {
        let notificationMessage = 'Customers page loaded.';
        await loadPageAndTestPageLoaded(driver, 'customers');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

       // Notify 'About' page load
       it('can notify About page load', async function() {
        let notificationMessage = 'About page loaded.';
        await loadPageAndTestPageLoaded(driver, 'about');
        let pageLoadMessage:string = await notifyPageLoad(driver);
        expect(pageLoadMessage).to.equal(notificationMessage);
      });

    });
  });

  // Called once
  after(async function() {
    await dm.releaseDriver(driver);
  });
});
