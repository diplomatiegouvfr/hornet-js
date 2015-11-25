"use strict";

var React = require('react');
var utils = require('hornet-js-utils');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var _ = utils._;

var logger = TestUtils.getLogger("hornet-js-components.test.table.table-spec"); //permet d'initiliser le logger pour les tests

var Table = require('src/table/table');
var Pagination = require('src/table/pagination');

var i18n = require('hornet-js-core/src/i18n/i18n-fluxible-plugin').i18n;

describe('Table', () => {
    it('doit prendre la configuration....', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $titre = $('h3.tableTitle');
        expect($titre).to.exist;
    });

    it('doit avoir une entête triable sur le Nom', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $lienTriNom = $('div.hornet-datatable-sort-liner a');
        expect($lienTriNom).to.exist
    });

    it('doit ajouter une ligne dans le Table', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $tr = $('table.hornet-datatable-table tbody tr');
        expect($tr).to.exist;
        expect($tr).to.have.length(1);

    });

    it('doit avoir des boutons de suppression', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $boutonSuppression = $('input.hijaxSupAllAction');
        //expect($boutonSuppression).to.exist;
    });

    it('doit avoir de boutons de pagination', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $divPagination = $('div.hornet-datatable-paginator-controls');
        expect($divPagination).to.exist;
    });


    it('doit etre un Table sans actions de masse', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        props.config.routes.deleteAll = undefined;
        props.config.options.hasDelAllButton = undefined;

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $boutonCheckAll = $('#listePartenairesContainer table thead tr th a.hijackCheckboxAll');
        expect($boutonCheckAll).to.not.exist;

        var $boutonUnCheckAll = $('#listePartenairesContainer table thead tr th a.hijackCheckboxNone');
        expect($boutonUnCheckAll).to.not.exist;

        var $checkBoxLinel = $('#listePartenairesContainer table tbody tr td.hornet-datatable-col-selection.hornet-datatable-cell input.hijackCheckbox');
        expect($checkBoxLinel).to.not.exist;

    });

    it('Aucun résultat dans le table', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);


        store.getAllResults = () => {
            return ({
                items: {},
                nbTotal: 0
            })
        }

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $selectLines = $('.listeTableContainer table tbody tr');
        logger.error($selectLines.html());
        expect($selectLines.length).to.equal(1);

    });

    it('currentPage à 1', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        var $currentPage = $('.id_for_indexPage').val();
        logger.error('page courante', $currentPage);
        expect($currentPage).to.equal("1");
    });


    it('afficher tous les résultats', () => {
        // Arrange
        var store = construitStore();
        var contexte = construitLeContext(store);

        var pagination = {
            pageIndex: 2,
            itemsPerPage: "-1",
            totalItems: 2
        };

        var onchangePaginationData = () => {
            return {}
        };

        // Act
        var $ = render(() =>
                <div>
                    <Pagination
                        tableName='table-spec'
                        onchangePaginationData={onchangePaginationData}
                        pagination={pagination}/>
                </div>
            , contexte
        );

        // Assert
        var $currentPage = $('[name="itemsPerPage"]').val();
        logger.error('items per page', $currentPage);
        expect($currentPage).to.equal("-1");
    });

    it('Tri activé', () => {
        // Arrange
        var store = construitStore();

        store.getSortData = () => {
            return ({
                key: 'nom',
                dir: 'ASC'
            })

        };

        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        // Assert
        $('table thead tr th').each(() => {
            if ($(this).find('div').html() == 'Nom') {
                expect($(this).attr('aria-sort')).to.equal('ascending');
                expect($(this).attr('title')).to.equal("Trier par Nom  dans l'ordre croissant");
                expect($(this).attr('class')).to.equal("hornet-datatable-sorted ");
            }
        });
    });

    //it('Filtres actifs', () => {
    //    // Arrange
    //    var store = construitStore();
    //    var props = construitsLesProperties(store);
    //    var contexte = construitLeContext(store);
    //
    //    props.config.options.isFiltersVisible = true;
    //    // Act
    //
    //    var $ = render(() =>
    //            <div>
    //                <Table config={props.config}/>
    //            </div>
    //        , contexte
    //    );
    //
    //    var $formFilter = $('[name="filterForm"]');
    //    expect($formFilter).to.exist;
    //
    //});
    it('Export désactivé', () => {
        // Arrange
        var store = construitStore();
        var props = construitsLesProperties(store);
        var contexte = construitLeContext(store);

        props.config.options.hasExportButtons = false;
        // Act

        var $ = render(() =>
                <div>
                    <Table config={props.config}/>
                </div>
            , contexte
        );

        expect($('input [name="export-pdf"]')).to.not.exist;
    });
});

function construitStore() {
    var TableTestStore = {
        getAllResults: () => {
            return {
                items: [
                    {
                        "id": "56",
                        "nom": "ALBERT",
                        "prenom": "Renaud",
                        "courriel": "renaud.albert@msn.com",
                        "organisme": "Organisme 2",
                        "vip": "oui",
                        "datemodification": "09/12/2015",
                        "secteur": "1",
                        "nationalite": "Française",
                        "civilite": "M."
                    }
                ]
                , nbTotal: 1
            }
        },
        getFormData: () => {
            return [];
        },
        getThemeCss: () => {
            return 'cssTest'
        },
        getThemeUrl: () => {
            return 'themeTestUrl';
        },
        getPaginationData() {
            return {};
        },
        getSortData() {
            return {};
        },
        getSelectedItems(key) {
            return key;
        },
        getFilterData() {
            return {};
        },
        getInfoNotifications() {
            return {}
        },
        getErrorNotifications() {
            return {}
        },
        getCurrentCsrf() {
            return {}
        }

    };

    return TableTestStore;
}

function construitsLesProperties(TableTestStore) {

    var config = {
        name: 'PARTENAIRES',
        columns: {
            nom: {titre: 'Nom', sort: 'text', filter: {type: 'text'}},
            prenom: {titre: 'Prénom', sort: 'text', filter: {type: 'text'}},
            courriel: {titre: 'Courriel', sort: 'text', filter: {type: 'text'}},
            organisme: {titre: 'Organisme', sort: 'text', filter: {type: 'text'}},
            vip: {titre: 'VIP', sort: 'text', filter: {type: 'checkbox'}},
            datemodification: {titre: 'Date de modification', sort: 'text', filter: {type: 'date'}}
        },
        store: TableTestStore,
        messages: {
            titleTable: "Liste des partenaires correspondant à la recherche",
            massDeletion: "Suppression en masse",
            emptyResult: "Aucune information à présenter.",
            captionText: "Liste des partenires avec fontionnalités d'export (csv, xls, pdf) suppression de masse, filtres avancés, ajout/édition/suppression d'un partenaire",
            deleteAllConfirmation: "Etes-vous sûr(e) de vouloir supprimer ce(s) élément(s)",
            addTitle: "Ajouter",
            filterValid: "Filtrer",
            filterValidTitle: "Filtrer",
            filterCancel: "Annuler",
            filterCancelTitle: "Annuler",
            hideFiltering: "Cacher le filtrage",
            hideFilteringTitle: "Cacher le filtrage"
        },
        options: {
            itemsPerPage: 10,
            hasFilter: true,
            clientSideSorting: false,
            hasExportButtons: true,
            hasAddButton: true,
            hasDelAllButton: true
        },
        routes: {
            search: '/partenaires/rechercher',
            delete: '/partenaires/supprimer',
            deleteAll: '/partenaires/supprimer/0',
            add: '/partenaires/creer',
            modify: '/partenaires/editer',
            view: '/partenaires/consulter'
        }
    };

    var props = {
        'config': config
    };
    return props;
}

function construitLeContext(TableTestStore) {
    var messages = {
        "table": {
            "filter": "Filtrer",
            "cancelFilter": "Annuler",
            "hideFiltering": "Cacher le filtrage",
            "hideFilter": "Cacher le filtre",
            "showFilter": "Afficher le filtrage",
            "emptyData": "Aucune information à présenter.",
            "addTitle": "Ajouter un partenaire",
            "selectedAllAlt": "Tout sélectionner",
            "selectedAllTitle": "Tout sélectionner",
            "deselectedAllAlt": "Tout désélectionner",
            "deselectedAllTitle": "Tout désélectionner",
            "sortedBy": "Trier par {columnTitle}",
            "descending": " dans l'ordre décroissant",
            "ascending": " dans l'ordre croissant",
            "rowNumber": "Lignes : ",
            "pageFooter": "Page :",
            "pageFooterOn": "sur"
        }
    };
    var context = {
        getStore: function (quelqueSoitLeStore) {
            return TableTestStore;
        },
        executeAction: () => {
        },

        locale: "fr-FR",
        i18n: function (keysString) {
            return i18n(messages)(keysString);
        }
    };
    return context;
}


