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
 * @version v5.3.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
Utils.setConfigObj({});
import { Decorators } from "hornet-js-test/src/decorators";
import { runTest } from "hornet-js-test/src/test-run";
import { HornetTestAssert } from "hornet-js-test/src/hornet-test-assert";
import { Form } from "src/widget/form/form";
import { AutoCompleteField } from "src/widget/form/auto-complete-field";
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import * as messages from "hornet-js-core/src/i18n/hornet-messages-components.json";
import { HornetReactTest } from "hornet-js-test/src/hornet-react-test";
import * as React from "react";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";

@Decorators.describe("Tests sur le déclenchement du onSelect d'un autocomplete")
class AutoCompleteOnSelectTest extends HornetReactTest {
    protected element: JSX.Element;
    protected dataSource:  DataSource<any>;
    protected autocompleteElement;
    protected dataSourceOnSelectCompteur: number = 0;

    @Decorators.beforeEach
    beforeEach() {
        Utils.setCls("hornet.internationalization", { messages });
        const dataSet = [{ value: 1, text: "titi" }, { value: 2, text: "tata" }, { value: 3, text: "tit" }];
        this.dataSource = new DataSource<any>(dataSet);

        this.dataSource.on("select", payload => {
            this.dataSourceOnSelectCompteur++;
            console.log("dataSource on.select", payload);
        });

        this.element = (
            <Form id="testFormAutocomplete">
                <AutoCompleteField
                    name="testAutocomplete"
                    dataSource={this.dataSource}
                    onSelect={event => {
                        console.log("Event :", event.nativeEvent.type);
                        if ((!this.isLeftOrRightKeyDownEvent(event))
                            && event.nativeEvent.type !== "selectionchange") {
                            console.log("props onSelect", event.target["value"]);
                        } else {
                            console.log("props onSelect sent to the else !");
                        }
                    }}
                    onChange={event => {
                        console.log("props onChange");
                    }}
                />
                <input name={"testhtmlinput"}
                    onSelect={event => {
                        console.log("Event :", event.nativeEvent.type);
                        console.log("props input onSelect");
                    }}
                />
            </Form>
        );
    }

    protected isLeftOrRightKeyDownEvent(event): boolean {
        return (event.nativeEvent.type === "keydown" &&
            (event.nativeEvent["keyCode"] === KeyCodes.LEFT_ARROW || event.nativeEvent["keyCode"] === KeyCodes.RIGHT_ARROW));
    }

    @Decorators.it("Test sur manipulation du DOM pour sélection")
    testManipulationDomSelection() {
        const id = this.generateMainId();
        let rendu = this.renderIntoDocument(this.element, `${id}`);

        setTimeout(() => {
            (document.querySelector(`#${id} #testAutocomplete`) as any).click();
            setTimeout(() => {
                const elts = document.querySelectorAll(`#${id} #testAutocomplete_select`);
                this.triggerMouseEvent(elts[0].firstElementChild, "mousedown");
                setTimeout(() => {
                    const data = { value: 1, text: "titi" };
                    HornetTestAssert.assertEquals(data, this.dataSource.selected, "Le clic de sélection n'a pas sélectionné le bon élément 1");
                    const htmlElement = document.querySelector(`#${id} #testFormAutocomplete`);
                    (htmlElement as any).click();
                    this.triggerMouseEvent(htmlElement, "mousedown");
                    setTimeout(() => {
                        (document.querySelector(`#${id} #testAutocomplete`) as any).click();
                        setTimeout(() => {
                            HornetTestAssert.assertLesserThan(2, this.dataSourceOnSelectCompteur, "Le datasource a déclenché trop d'event select");
                            HornetTestAssert.assertGreaterThan(0, this.dataSourceOnSelectCompteur, "Le datasource n'a pas déclenché d'event select");
                            (document.querySelector(`#${id} #testAutocomplete`) as any).click();
                            const elts = document.querySelectorAll(`#${id} #testAutocomplete_select`);
                            this.triggerMouseEvent(elts[0].children[1], "mousedown");
                            setTimeout(() => {
                                const data = { value: 2, text: "tata" };
                                HornetTestAssert.assertEquals(data, this.dataSource.selected, "Le clic de sélection n'a pas sélectionné le bon élément 2");
                                HornetTestAssert.assertLesserThan(3, this.dataSourceOnSelectCompteur, "Le datasource a déclenché trop d'event select");
                                HornetTestAssert.assertGreaterThan(1, this.dataSourceOnSelectCompteur, "Le datasource n'a pas déclenché d'event select");
                                this.end();
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 100);
        }, 500);
    }

    @Decorators.it("Test sur appuis touche escape")
    testEscapeKeyDown() {
        const id = this.generateMainId();
        let rendu = this.renderIntoDocument(this.element, `${id}`);

        setTimeout(() => {
            (document.querySelector(`#${id} #testAutocomplete`) as any).click();
            setTimeout(() => {
                const elts = document.querySelectorAll(`#${id} #testAutocomplete_select`);
                this.triggerMouseEvent(elts[0].firstElementChild, "mousedown");
                setTimeout(() => {
                    const data = { value: 1, text: "titi" };
                    HornetTestAssert.assertEquals(data, this.dataSource.selected, "Le clic de sélection n'a pas sélectionné le bon élément");
                    const inputElement = document.querySelector(`#${id} #testAutocomplete`);
                    this.triggerKeydownEvent(inputElement, "escape", KeyCodes.ESCAPE);
                    setTimeout(() => {
                        HornetTestAssert.assertEquals(null, this.dataSource.selected, "Le datasource n'a pas été vidé sur escape");
                        this.end();
                    }, 500);
                }, 500);
            }, 100);
        }, 500);
    }

    @Decorators.after
    after() {
        if (this.dataSource) {
            this.dataSource.removeAllListeners();
        }
    }
}

//lancement des Tests
runTest(new AutoCompleteOnSelectTest());