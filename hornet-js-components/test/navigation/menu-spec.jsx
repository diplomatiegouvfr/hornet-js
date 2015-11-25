"use strict";

var utils = require('hornet-js-utils');
var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var chai = TestUtils.chai;
var expect = chai.expect;
var sinon = TestUtils.sinon;
var render = TestUtils.render;
var logger = TestUtils.getLogger("hornet-js-components.test.navigation.menu-spec");

var Menu = require('src/navigation/menu');

var NavigationBaseStore = require('src/navigation/store/navigation-base-store').NavigationBaseStore;
var PageInformationStore = require("hornet-js-core/src/stores/page-informations-store");
var InfosComplementaires = require('src/navigation/menu-infos-complementaires');

utils.setConfigObj({
    contextPath: ""
});

describe('MenuSpec', () => {
    it('doit afficher le menu avec restriction des rôles', () => {
        // Arrange
        var NavigationBaseStoreMock = {};
        NavigationBaseStoreMock.getConfigMenu = sinon.stub().returns(require('test/navigation/menu-test-app-conf').menu);

        var PageInformationStoreMock = {};
        PageInformationStoreMock.userHasRole = (roles) => {
            if (roles === 'user') {
                return true;
            } else {
                return false;
            }
        };
        PageInformationStoreMock.getThemeCss = sinon.stub().returns({});
        PageInformationStoreMock.getThemeUrl = () => {return "themeTestURL"};

        var context = {};
        context.getStore = (store) => {
            if (store === PageInformationStore) {
                return PageInformationStoreMock;
            } else if (store === NavigationBaseStoreMock) {
                return NavigationBaseStoreMock;
            } else {
                chai.assert.fail(store, 'other', 'Appel de getStore avec un store inconnu');
                throw new Error('Appel de getStore avec un store inconnu');
            }
        };
        context.i18n = sinon.stub().returnsArg(0);
        context.getHornetContext = sinon.stub().returns(context);

        // Act
        var $ = render(() => (
                <div>
                    <Menu store={NavigationBaseStoreMock}/>
                </div>)
            , context, true
        );

        // Assert
        expect($('nav#nav')).to.exist;
        expect($('.menuHaut').html()).to.be.equal('<nav role="navigation" id="nav" data-title="Menu"><ul class="nav" role="menubar"><li class="nav-item" role="presentation"><a href="/cas1" id="nav-1" data-indice="1" role="menuitem" aria-haspopup="true"><div>cas1</div></a></li><li class="nav-item" role="presentation"><a href="#" class="having-sub-nav" id="nav-3" data-indice="3" role="menuitem" aria-haspopup="true"><div>cas3<img alt="sous-menu de cas3" src="undefined/undefined/undefined/img/menu/picto_fleche.png" class="subnav-0"></div></a><ul class="nav sub-nav-1 masked" role="menu" aria-labelledby="nav-3"><li class="sub-nav-item" role="presentation"><a href="/cas3.1" id="nav-31" data-indice="31" role="menuitem"><div>cas3.1</div></a></li></ul></li></ul></nav>');
    });

    it('doit afficher les infos complémentaires', () => {
        // Arrange
        var NavigationBaseStoreMock = {};
        NavigationBaseStoreMock.getConfigMenu = sinon.stub().returns({});

        var context = {};
        context.getStore = (store) => {
            if (store === PageInformationStore) {
                return {};
            } else if (store === NavigationBaseStoreMock) {
                return NavigationBaseStoreMock;
            } else {
                chai.assert.fail(store, 'other', 'Appel de getStore avec un store inconnu');
                throw new Error('Appel de getStore avec un store inconnu');
            }
        };

        context.i18n = () => {
            return {}
        };

        // Act
        var $ = render(() => (
                <div>
                    <Menu store={NavigationBaseStoreMock}>
                        <InfosComplementaires>
                            <div id="testChild"/>
                        </InfosComplementaires>
                    </Menu>
                </div>)
            , context, true
        );

        // Assert
        expect($('nav#nav')).to.exist;
        expect($('.menuHaut').html()).to.be.equal('<nav role="navigation" id="nav" data-title="Menu"><ul class="nav" role="menubar"><li class="nav-item infocomp"><div id="testChild"></div></li></ul></nav>');
    });
});
