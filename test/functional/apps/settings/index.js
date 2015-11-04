define(function (require) {
  var bdd = require('intern!bdd');
  var expect = require('intern/dojo/node!expect.js');
  var config = require('intern').config;
  var url = require('intern/dojo/node!url');
  var _ = require('intern/dojo/node!lodash');
  var Common = require('../../../support/pages/Common');
  var ScenarioManager = require('intern/dojo/node!../../../fixtures/scenarioManager');

  var initialStateTest = require('./_initial_state');
  var createButtonTest = require('./_create_button');
  var namePatternCheckboxTest = require('./_name_pattern_checkbox');
  var indexPatternCreateDeleteTest = require('./_index_pattern_create_delete');
  var indexPatternResultsSortTest = require('./_index_pattern_results_sort');
  var indexPatternPopularityTest = require('./_index_pattern_popularity');

  bdd.describe('settings app', function () {
    var common;
    var scenarioManager;
    var remote;

    function checkForSettingsUrl() {
      return common.tryForTime(25000, function () {
        return remote.get(url.format(_.assign(config.servers.kibana, {
          pathname: ''
        })))
        .then(function () {
          // give angular enough time to update the URL
          return common.sleep(2000);
        })
        .then(function () {
          return remote.getCurrentUrl()
          .then(function (currentUrl) {
            expect(currentUrl).to.contain('settings');
          });
        });
      });
    }

    // on setup, we create an settingsPage instance
    // that we will use for all the tests
    bdd.before(function () {
      common = new Common(this.remote);
      scenarioManager = new ScenarioManager(url.format(config.servers.elasticsearch));
      remote = this.remote;

      return scenarioManager.loadIfEmpty('makelogs');
    });

    bdd.beforeEach(function () {
      return scenarioManager.reload('emptyKibana')
      .then(function () {
        return checkForSettingsUrl();
      });
    });

    bdd.after(function () {
      return scenarioManager.unload('makelogs')
      .then(function () {
        scenarioManager.unload('emptyKibana');
      });
    });

    initialStateTest(bdd);

    createButtonTest(bdd);

    namePatternCheckboxTest(bdd);

    indexPatternCreateDeleteTest(bdd);

    indexPatternResultsSortTest(bdd);

    indexPatternPopularityTest(bdd);
  });
});
