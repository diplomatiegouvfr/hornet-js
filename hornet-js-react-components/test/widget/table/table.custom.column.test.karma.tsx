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

import { Utils } from "hornet-js-utils";
Utils.setConfigObj({});

import { TestUtils } from "hornet-js-test/src/test-utils";
const expect = TestUtils.chai.expect;

import * as React from "react";

import { HornetReactTest } from "hornet-js-test/src/hornet-react-test";
import { runTest } from "hornet-js-test/src/test-run";
import { Decorators } from "hornet-js-test/src/decorators";
import * as assert from "assert";

import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import { Table } from "src/widget/table/table";
import { Header } from "src/widget/table/header";
/* Composant Content */
import { Content } from "src/widget/table/content";

import { YesNoColumn } from "src/widget/table/column/yesno-column";
import { DateColumn } from "src/widget/table/column/date-column";
import { Columns } from "src/widget/table/columns";
const messages = require("hornet-js-core/src/i18n/hornet-messages-components.json");
import { MoreInfoColumn } from "src/widget/table/column/more-info-column";


/** Tableau de liste de secteurs */
let dataSourceSortTitle: DataSource<any>;
let tableElement: JSX.Element;
let tableElement2: JSX.Element;
let tableElement3: JSX.Element;
let table;
let data;

@Decorators.describe("Test YesNo Column")
class tableTest extends HornetReactTest {

    @Decorators.beforeEach
    beforeEach() {
        Utils.setCls("hornet.internationalization", { messages});
        data = [];
        for (let i: number = 1; i < 10; i++) {
            data.push({ id: i, vip: (i % 2 === 0) ? true : false, date: Date.now()});
        }
        dataSourceSortTitle = new DataSource(data);

        tableElement = (
            <Table id="lite">
                <Header title={"Secteurs"}>
                </Header>
                <Content dataSource={dataSourceSortTitle}>
                    <Columns>
                        <YesNoColumn keyColumn="vip" title="YesNO"/>
                    </Columns>
                </Content>
            </Table>
        );


        tableElement2 = (
            <Table id="lite">
                <Header title={"Secteurs"}>
                </Header>
                <Content dataSource={dataSourceSortTitle}>
                    <Columns>
                        <DateColumn keyColumn="date" title={"date"} titleCell={"coucou"}/>
                    </Columns>
                </Content>
            </Table>
        );

        tableElement3 = (
            <Table id="lite">
                <Header title={"Secteurs"}>
                </Header>
                <Content dataSource={dataSourceSortTitle}>
                    <Columns>
                        <MoreInfoColumn keyColumn="date" title={"date"}/>
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


    @Decorators.it("Manipuler customColumns de type YesNo")
    renderTableYesno() {
        const id = this.generateMainId();
        table = this.renderIntoDocument(tableElement, id);
        dataSourceSortTitle.on("fetch", (value) => {
            expect(document.querySelector(`#${id} #lite-0-colBody-0-0`).innerHTML).to.be.equal("non");
            expect(document.querySelector(`#${id} #lite-0-colBody-1-0`).innerHTML).to.be.equal("oui");
            this.end();
        });
        dataSourceSortTitle.reload();
    }

    @Decorators.it("Manipuler customColumns de type Date")
    renderTableDate() {
        const id = this.generateMainId();
        table = this.renderIntoDocument(tableElement2, id);
        dataSourceSortTitle.on("fetch", (value) => {
            const year = new Date().getFullYear().toString();
            const yearInTableDateColumn = document.querySelector(`#${id} #lite-0-colBody-0-0`).innerHTML.split("/");
            expect(yearInTableDateColumn[2]).to.be.equal(year);
            expect(document.querySelector(`#${id} #lite-0-colBody-0-0`).getAttribute("title")).to.be.equal("coucou");
            this.end();
        });
        dataSourceSortTitle.reload();
    }

    @Decorators.it("Manipuler customColumns de type MoreInfo")
    renderTableMoreInfo() {
        const id = this.generateMainId();
        table = this.renderIntoDocument(tableElement3, id);
        dataSourceSortTitle.on("fetch", (value) => {
            const year = new Date().getFullYear().toString();
            const imgCell = document.querySelector(`#${id} #lite-0-colBody-0-0 a svg`);
            expect(imgCell).to.exist;
            this.end();
        });
        dataSourceSortTitle.reload();
    }

}

// lancement des Tests
runTest(new tableTest());
