/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-react-components - Ensemble des composants web React de base de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.4.1
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

"use strict";
import { Utils } from "hornet-js-utils";
Utils.setConfigObj({});

import { TestUtils } from "hornet-js-test/src/test-utils";
const expect = TestUtils.chai.expect;

import isEqual = require("lodash.isequal");
import * as React from "react";

import { BaseTest } from "hornet-js-test/src/base-test";
import { runTest } from "hornet-js-test/src/test-run";
import { Decorators } from "hornet-js-test/src/decorators";
import { SortData, SortDirection } from "hornet-js-core/src/component/sort-data";
import * as assert from "assert";

import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import { Table } from "src/widget/table/table";
import { Header } from "src/widget/table/header";
/* Composant Content */
import { Content } from "src/widget/table/content";
/*  Colonne du tableau */
import { Column } from "src/widget/table/column";
import { Columns } from "src/widget/table/columns";
import { CheckColumn } from "src/widget/table/column/check-column";
import { ActionColumn } from "src/widget/table/column/action-column";
import { MoreInfoColumn } from "src/widget/table/column/more-info-column";

/** Tableau de liste de secteurs */

@Decorators.describe("Test Karma table selection")
class tableTest extends BaseTest {

    private dataSourceTriTableSelect: DataSource<any>;
    private tableElement: JSX.Element;
    private tableElementWithActionColumns: JSX.Element;
    private data;
    private id;
    
    @Decorators.before
    before() {
        this.data = [];
        let step = 1;
        for (let i: number = 1; i < 10; i++) {
            this.data.push({ id: i, label: "libelle" + i, desc: (step % 3 === 0) ? "desc" + 0 : "desc" + step++ });
        }
    }

    @Decorators.beforeEach
    beforeEach() {

        if(this.dataSourceTriTableSelect) {
            this.dataSourceTriTableSelect.removeAllListeners();
        }
        this.dataSourceTriTableSelect = new DataSource(this.data);

        this.tableElement = (
            <Table id="lite">
                <Header title={"Secteurs"}>
                </Header>
                <Content dataSource={this.dataSourceTriTableSelect}>
                    <Columns>
                        <CheckColumn keyColumn="id" />
                        <Column keyColumn="label" title={"libelle"} sortable={true} />
                        <Column keyColumn="desc" title={"desc"} sortable={true} />
                    </Columns>
                </Content>
            </Table>
        );

        this.tableElementWithActionColumns = (
            <Table id="table-with-action-column">
                <Header title={"Secteurs"}>
                </Header>
                <Content dataSource={this.dataSourceTriTableSelect}>
                    <Columns>
                        <CheckColumn keyColumn="id" />
                        <Column keyColumn="label" title={"libelle"} sortable={true} />
                        <Column keyColumn="desc" title={"desc"} sortable={true} />
                        <ActionColumn keyColumn="editer"
                                // srcImg={Picto.blue.editer}
                                alt={"Editer {label}"}
                                action={()=>{}}/>
                        <MoreInfoColumn keyColumn="idMore" visible={(value) => true}
                                alt={"Plus d'info sur {label} {desc}"}
                                headers={["label", "desc"]}>
                            </MoreInfoColumn>    
                    </Columns>
                </Content>
            </Table>
        );
    }

    @Decorators.it("Test OK")
    testOk() {
        assert.equal(1, 1);
        this.end();
    }

    @Decorators.it("selectionner un element dans le tableau")
    selectionUnElement() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElement, this.id);
        this.dataSourceTriTableSelect.on("fetch", () => {
            this.triggerMouseEvent(document.querySelector(`#${this.id} #lite-0-colBody-1-0 input`), "click");
        });
        this.dataSourceTriTableSelect.on("select", () => {
            expect(isEqual(this.dataSourceTriTableSelect.selected[0], { id: 2, label: "libelle2", desc: "desc2" })).to.be.true;
            this.end();

        });
        this.dataSourceTriTableSelect.reload();
    }

    @Decorators.it("afficher un tableau avec des elements déjà sélectionnés")
    affichageElementSelectionne() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElement, this.id);
        this.dataSourceTriTableSelect.select([{ id: 2, label: "libelle2" }, { id: 4, label: "libelle4" }]);


        this.dataSourceTriTableSelect.on("fetch", (value) => {

            expect(document.querySelector(`#${this.id} #lite-0-colBody-1-0 input:checked`)).to.exist;
            expect(document.querySelector(`#${this.id} #lite-0-colBody-3-0 input:checked`)).to.exist;
            this.end();

        });
        this.dataSourceTriTableSelect.reload();
    }

    @Decorators.it("trier un tableau sur une colonne")
    triSimple() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElement, this.id);
        this.dataSourceTriTableSelect.on("sort", () => {

            expect((document.querySelector(`#${this.id} #lite-0-colBody-0-1`) as any).innerHTML).to.be.equal("libelle9");
            this.end();

        });

        this.dataSourceTriTableSelect.sort({ sortDatas: [new SortData("label", SortDirection.DESC)] });
    }

    @Decorators.it("trier un tableau sur plusieurs colonnes part1")
    triMultiple1() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElement, this.id);
        this.dataSourceTriTableSelect.on("sort", () => {
            setTimeout(() => {
                expect((document.querySelector(`#${this.id} #lite-0-colBody-0-1`) as any).innerHTML).to.be.equal("libelle3");
                expect((document.querySelector(`#${this.id} #lite-0-colBody-6-1`) as any).innerHTML).to.be.equal("libelle9");
                expect((document.querySelector(`#${this.id} #lite-0-colBody-7-1`) as any).innerHTML).to.be.equal("libelle1");
                expect((document.querySelector(`#${this.id} #lite-0-colBody-8-1`) as any).innerHTML).to.be.equal("libelle2");
                this.end();
            }, 500);

        });
        this.dataSourceTriTableSelect.sort({ sortDatas: [new SortData("desc", SortDirection.ASC), new SortData("label", SortDirection.ASC)] });
    }

    @Decorators.it("trier un tableau sur plusieurs colonnes part2")
    triMultiple2() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElement, this.id);
        this.dataSourceTriTableSelect.on("sort", () => {
            setTimeout(() => {
                expect((document.querySelector(`#${this.id} #lite-0-colBody-0-1`) as any).innerHTML).to.be.equal("libelle2");
                expect((document.querySelector(`#${this.id} #lite-0-colBody-1-1`) as any).innerHTML).to.be.equal("libelle1");
                expect((document.querySelector(`#${this.id} #lite-0-colBody-2-1`) as any).innerHTML).to.be.equal("libelle9");
                expect((document.querySelector(`#${this.id} #lite-0-colBody-8-1`) as any).innerHTML).to.be.equal("libelle3");
                this.end();
            }, 500);
        });
        this.dataSourceTriTableSelect.sort({ sortDatas: [new SortData("desc", SortDirection.DESC), new SortData("label", SortDirection.DESC)] });
    }

    @Decorators.it("test du rendu de l'action column après tri colonnes part1")
    testRenderActionColumnAfterSortAscOnLabelAndDesc() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElementWithActionColumns, this.id);
        this.dataSourceTriTableSelect.on("sort", () => {
            setTimeout(() => {
                expect((document.querySelector(`#${this.id} #table-with-action-column-0-colBody-6-3 a`) as any).title).to.be.equal("Editer libelle9");
                expect((document.querySelector(`#${this.id} #table-with-action-column-0-colBody-6-4 a`) as any).title).to.be.equal("Plus d'info sur libelle9 desc0");
                this.end();
            }, 500);
        });
        this.dataSourceTriTableSelect.sort({ sortDatas: [new SortData("desc", SortDirection.ASC), new SortData("label", SortDirection.ASC)] });
    }


    @Decorators.it("test du rendu de l'action column après tri colonnes part2")
    testRenderActionColumnAfterSortDescOnLabelAndDesc() {
        this.id = this.generateMainId();
        this.renderIntoDocument(this.tableElementWithActionColumns, this.id);
        this.dataSourceTriTableSelect.on("sort", () => {
            setTimeout(() => {
                expect((document.querySelector(`#${this.id} #table-with-action-column-0-colBody-2-3 a`) as any).title).to.be.equal("Editer libelle9");
                expect((document.querySelector(`#${this.id} #table-with-action-column-0-colBody-2-4 a`) as any).title).to.be.equal("Plus d'info sur libelle9 desc0");
                this.end();
            }, 500);
        });
        this.dataSourceTriTableSelect.sort({ sortDatas: [new SortData("desc", SortDirection.DESC), new SortData("label", SortDirection.DESC)] });
    }

    @Decorators.after
    after() {
        if(this.dataSourceTriTableSelect) {
            this.dataSourceTriTableSelect.removeAllListeners();
        }
    }

}

// lancement des Tests
runTest(new tableTest());

