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
import { Logger } from "hornet-js-logger/src/logger";
import * as React from "react";
import { HornetComponent } from "src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Dropdown, Position } from "src/widget/dropdown/dropdown";
import { ActionButton, ActionButtonProps, TypeAction } from "src/widget/table/action-button";
import { TableButtonInfoAccessibilite } from "src/widget/table/table-button-info-accessibilite";
import { SvgSprites } from "src/widget/icon/svg-sprites";

import "src/widget/table/sass/_datatable-menu.scss";
import "src/widget/button/sass/_buttons.scss";


/**
 * Propriétés du MenuActions
 */
export interface MenuActionsProps extends HornetComponentProps {
    id?: string;
    items?: any;
    actions?: Array<any>;
    selectedItems?: Array<any>;
    showAlert?: Function;
    showIconInfo?: boolean;
    toggleColumns?: boolean;
    columns?: any;
    toggleColumnsButton?: typeof HornetComponent;
}

const logger: Logger = Logger.getLogger("hornet-js-react-components.widget.table.menu-actions");

/**
 * Classe permettant de générer le rendu html du Menu d'actions d'un tableau
 */
export class MenuActions<P extends MenuActionsProps> extends HornetComponent<P, any> {

    constructor(props?: P, context?: any) {
        super(props, context);

        this.state = {
            ...this.state,
            title: this.i18n("table.menuActions.title"),
        };
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.debug("MenuActions render : ", this.props.id ? this.props.id : this.state.title);
        logger.trace("render MenuActions");
        const actions = this.getMenuActions();
        return (
            <div className="datatable-header-menu flex-container fr">
                {(actions.priorityActions.length > 0) ? MenuActions.renderPriorityActions(actions.priorityActions) :
                    <div className="menu-priority-container" />}
                {(actions.dropdownItems.length > 0) ? this.renderDropDownActions(actions.dropdownItems) : <div />}
            </div>
        );
    }

    /**
     * retourne les actions du menu contextuel
     * @returns {Array}
     */
    getMenuActions() {
        const priorityActions = [];
        const dropdownItems = [];
        const item = this.props.selectedItems ? this.props.selectedItems[0] : {};
        const self = this;

        if (this.props.showIconInfo) {
            priorityActions.push(<TableButtonInfoAccessibilite color={"#ffffff"} key={this.props.id + "-icon-info"}/>);
        }

        if (this.props.toggleColumnsButton) {
            const WrappedToggleColumnsButton = this.props.toggleColumnsButton;
            priorityActions.push(WrappedToggleColumnsButton);
        }

        if (this.props.actions && this.props.actions.length > 0) {
            this.props.actions.map((action, index) => {
                if ((action.props.typeAction === TypeAction.ACTION_MASSE && self.props.selectedItems && self.props.selectedItems.length > 0)
                    || (action.props.typeAction === TypeAction.ACTION_UNITAIRE
                        && self.props.selectedItems && self.props.selectedItems.length === 1)
                    || !action.props.typeAction) {
                    const propsButtons: ActionButtonProps = { ...action.props };

                    propsButtons.showAlert = this.props.showAlert;
                    propsButtons.selectedItems = this.props.selectedItems;
                    propsButtons.items = this.props.items;
                    propsButtons["key"] = self.props.id + "-menuAction-" + index;
                    propsButtons["value"] = item;

                    const isVisible: boolean = propsButtons.items.length > 0 || propsButtons.displayedWithoutResult;

                    if (isVisible && (!propsButtons.visible || propsButtons.visible && propsButtons.visible())) {

                        if (!propsButtons.priority) {
                            dropdownItems.push({
                                id: propsButtons.id,
                                label: propsButtons.label,
                                action: propsButtons.action,
                                url: propsButtons.url ? this.genUrlWithParams(propsButtons.url, item || {}) : null,
                                icon: propsButtons.srcImg,
                                className: propsButtons.className ? "material-dropdown-menu__link " + propsButtons.className :
                                    "material-dropdown-menu__link",
                                key: propsButtons.id || index + "-menuAction-" + index,
                                valueCurrent: item,
                                title: propsButtons.title,
                            });
                        } else {
                            const newProps = { ...propsButtons };
                            newProps.label = null;
                            const actionButton = <ActionButton {...newProps} />;
                            priorityActions.push(actionButton);
                        }
                    }
                }
            });
        }
        return {
            priorityActions,
            dropdownItems,
        };
    }

    /**
     * Rendu Html du composant dropDown du Header du menu Table
     * @param actions
     * @returns {any}
     */
    renderDropDownActions(actions): JSX.Element {
        return (
            <div className="fr menu-contextuel-container">
                <Dropdown
                    id={this.props.id}
                    srcImg={<SvgSprites icon="list" />}
                    className="menu-contextuel"
                    type="button"
                    items={actions}
                    title={this.state.title}
                    position={Position.BOTTOMRIGHT} />
            </div>
        );
    }

    /**
     * Rendu Html des actions prioritaires du Header du menu Table
     * @param actions
     * @returns {any}
     */
    static renderPriorityActions(actions): JSX.Element {
        return (
            <div className="menu-priority-container">
                <div className="menu-priority-content">
                    <ul>
                        {actions.map((action) => {
                            return <li key={"li-" + action.key}>
                                <div className="menu-priority-content-action">{action}</div>
                            </li>;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
