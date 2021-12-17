const {
    TestSuite, Constants, SeleniumUtils, assert, STATUS_OK, api, LaunchPageObjRepo, AutoDesign, AutoDesignPage3, AutoDesignPage4, ProjectDetailsModal, ProjectPage, ItemListModal,
  } = require('../../TestSuite');
  const testSuiteDescription1 = 'Auto Design_Create and Save Project with one Base cabinet';
  const testSuiteDescription2 = 'Auto Design_Price on UI in Project';
  let requestObjByme;
  let projectName;
  
  function setPreTestCaseCondition(driver) {
    return driver
      .then(() => SeleniumUtils.goToLaunchPage(driver))
      .then(() => SeleniumUtils.waitVeryLongForElementByCss(driver, LaunchPageObjRepo.launchPage.startDesigning.css))
      .catch((err) => {
        console.error('error in setPreTestCaseCondition: ' + global.currentTestFile, err);
        throw err;
      });
  }
  
  function setPostTestSuiteCondition(driver) {
    return driver
      .then(() => ItemListModal.close(driver))
      .catch(() => console.log(''))
      .then(() => SeleniumUtils.closeDesign(driver))
      .catch(() => console.log(''))
      .then(() => SeleniumUtils.goToLaunchPage(driver))
      .catch(() => console.log(''))
      .then(() => ProjectDetailsModal.closeProjectDetailsModal(driver))
      .catch(() => console.log(''))
      .then(() => {
        if (projectName !== '' && projectName !== undefined) {
          return SeleniumUtils.deleteSavedDesignFromProjectPage(driver, projectName);
        }
      })
      .catch(() => console.log(''))
      .then(() => SeleniumUtils.logoutViaProjectsPage(driver))
      .catch(() => console.log(''));
  }
  
  TestSuite(`${testSuiteDescription1} \n`, (driver) => {
    let projectId;
    before('', (done) => {
      driver
        .then(async () => {
          requestObjByme = await api.getBymeApiRequestObject();
        })
        .then(() => console.log('Done with Setting pre-TestSuite condition in before'))
        .then(() => done())
        .catch((err) => {
          console.error('error in before: ' + global.currentTestFile, testSuiteDescription1, err);
          throw err;
        });
    });
  
    beforeEach('', (done) => {
      driver
        .then(() => setPreTestCaseCondition(driver))
        .then(() => console.log('Done with Setting pre-TestCase condition in beforeEach'))
        .then(() => done())
        .catch((err) => {
          console.error('error in beforeEach: ' + global.currentTestFile, testSuiteDescription1, err);
          throw err;
        });
    });
  
    afterEach('', (done) => {
      driver
        .then(() => console.log('Done with ReSetting post-TestCase condition in afterEach'))
        .then(() => done())
        .catch((err) => {
          console.error('error in afterEach: ' + global.currentTestFile, testSuiteDescription1, err);
        });
    });
  
    after((done) => {
      let logsFileName = './test-results/browser_logs/' + testSuiteDescription1;
      driver
        .then(() => setPostTestSuiteCondition(driver))
        .catch(() => console.log('Clean up is unsucessful'))
        .then(() => SeleniumUtils.saveBrowserLogs(driver, logsFileName))
        .catch(() => console.log('Could not save Browser console logs for ' + logsFileName))
        .then(() => console.log('Done with ReSetting post-Testsuite condition in after'))
        .then(() => process.nextTick(done));
    });
  
    it('User can create a project with one base cabinet (first base cabinet displayed) added in it and navigate to Step 4 of design and save the project', (done) => {
      driver
        .then(() => AutoDesign.createProjWithCabinetAndGoToNextStep(driver, true, Constants.meCode , true))
        .then((designInfo) => {
          projectName = designInfo.savedProjectName;
          // currentStep has been commented out in AutoDesign.createProjWithCabinetAndGoToNextStep()
          // assert.equal(designInfo.currentStep, 'step-4', 'User is not at step 4 of design.');
        })
        .then(() => AutoDesignPage4.getProjectTotalPrice(driver))
        .then((projectTotalPrice) => {
          assert.notEqual(projectTotalPrice, 0.00, 'User is not able to add a cabinet>> Total price displaying for project on last step of design is 0.00');
        })
        .then(() => AutoDesign.closeDesignAndGetProjID(driver, projectName))
        .then((projectIdUI) => {
          projectId = projectIdUI;
        })
        .then(() => requestObjByme.getProject(projectId))
        .then((result) => {
          assert.equal(result.statusCode, STATUS_OK, 'status code for getProject from 3dvia for project id=' + projectId + 'is ' + result.statusCode);
          assert.equal(JSON.parse(result.data).bmProjUUID, projectId, 'bmProjUUID for getProject from 3dvia for project id=' + projectId + 'is ' + JSON.parse(result.data).bmProjUUID);
          assert.equal(JSON.parse(result.data).projectUUID, projectId, 'projectUUID for getProject from 3dvia for project id=' + projectId + 'is ' + JSON.parse(result.data).projectUUID);
        })
        .then(() => done());
    });
  });
  
  TestSuite(testSuiteDescription2 + ' \n', (driver) => {
    before('', (done) => {
      driver
        .then(async () => {
          requestObjByme = await api.getBymeApiRequestObject();
          return requestObjByme;
        })
        .then(() => console.log('Done with Setting pre-TestSuite condition in before'))
        .then(() => done())
        .catch((err) => {
          console.error('error in before: ' + global.currentTestFile, testSuiteDescription2, err);
          throw err;
        });
    });
  
    beforeEach('', (done) => {
      driver
        .then(() => setPreTestCaseCondition(driver))
        .then(() => console.log('Done with Setting pre-TestCase condition in beforeEach'))
        .then(() => done())
        .catch((err) => {
          console.error('error in beforeEach: ' + global.currentTestFile, testSuiteDescription2, err);
          throw err;
        });
    });
  
    afterEach('', (done) => {
      driver
        .then(() => console.log('Done with ReSetting post-TestCase condition in afterEach'))
        .then(() => done())
        .catch((err) => {
          console.error('error in afterEach: ' + global.currentTestFile, testSuiteDescription2, err);
        });
    });
  
    after((done) => {
      let logsFileName = './test-results/browser_logs/' + testSuiteDescription2;
      driver
        .then(() => setPostTestSuiteCondition(driver))
        .catch(() => console.log(''))
        .then(() => SeleniumUtils.saveBrowserLogs(driver, logsFileName))
        .catch(() => console.log('Could not save Browser console logs for ' + logsFileName))
        .then(() => console.log('Done with ReSetting post-TestSuite condition in after'))
        .then(() => process.nextTick(done));
    });
  
    it('User can see price and total price for a project at Auto design page 3 and 4 and Item list and Project details Modal', (done) => {
      let previewPrice;
      let totalPrice;
      driver
        .then(() => SeleniumUtils.startDesigningFromLaunchPage(driver))
        .then(() => SeleniumUtils.addCabinet(driver, Constants.meCode))
        .then(() => AutoDesignPage3.saveDesignAndGetProjectPreviewPrice(driver))
        .then((designInfo) => {
          assert.isOk(designInfo.projectPreviewPrice, 'Project preview price is not present or not displaying');
          previewPrice = designInfo.projectPreviewPrice;
          projectName = designInfo.savedProjectName;
        })
        .then(() => AutoDesignPage4.goToStep4AndGetProjectTotalPrice(driver))
        .then((projectTotalPrice) => {
          assert.equal(projectTotalPrice, previewPrice, 'Project total price on last-4th step of design did not match previewPrice on 3rd step of design');
          totalPrice = projectTotalPrice;
        })
        .then(() => ItemListModal.openItemList(driver))
        .then((itemListModalOpens) => {
          console.log('itemListModalOpens is ' + itemListModalOpens);
          assert.equal(itemListModalOpens, true, 'User is not able to Open or see item list Modal data');
        })
        .then(() => ItemListModal.getPrices(driver))
        .then((price) => {
          assert.equal(price.totalPriceProject, totalPrice, 'Project total price (Item list) did not match total price of project on last-4th step of design');
        })
        .then(() => ItemListModal.close(driver))
        .then(() => SeleniumUtils.closeDesign(driver))
        .then(() => ProjectPage.openProjectDetailsModal(driver, projectName))
        .then(() => ProjectDetailsModal.getProjectTotalPrice(driver))
        .then((projectModalPrice) => {
          assert.isNotEmpty(projectModalPrice, 'Project total price (Project Details Modal) does not exist');
          assert.equal(projectModalPrice, totalPrice, 'Project total price (Project Details Modal) did not match total price of project on last-4th step of design');
        })
        .then(() => ProjectDetailsModal.closeProjectDetailsModal(driver))
        .then(() => done());
    });
  });
  