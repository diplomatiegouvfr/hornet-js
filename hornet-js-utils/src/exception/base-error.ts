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
 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.4.1
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import merge = require ("lodash.merge");
import * as util from "util";

declare global {

    interface Error {
        toLog?: Function;
    }
}
export class BaseError {
    /**
     * Timestamp (en ms depuis Epoch) correspondant à la date de création de l'erreur. L'utilisation d'un timestamp
     * plutôt qu'un objet Date facilite la sérialisation/désérialisation en json.
     */
    public date: number;
    /** Code d'erreur, normalement associé à un message internationalisé */
    public code: string;
    public message: string;
    public name: string;
    /** Paramètres utilisables dans la construction du message d'erreur correspondant au code */
    public args: { [ key: string ]: string };
    public err_cause: Error;
    public reportId: string;
    public stack: any;
    public backend: boolean = false;

    constructor(code: string = "", message: string = "", args: { [ key: string ]: any } = {}, cause?: Error ) {
        Error.call(this);

        this.date = new Date().getTime();
        this.code = code;
        this.message = message;
        this.args = merge(args || {}, {});
        (<any>Error).captureStackTrace(this, this.constructor);
        this.err_cause = cause;
    }

    cause() {
        return this.err_cause;
    }

    toLog() {
        const errStr = this.toString();
    
        let infoSupp;
        try {
            infoSupp = JSON.stringify(this);
        }
        catch (err) {
            infoSupp = "<stringifyErr>";
        }

        let stacks = this.stack;
        if (this.cause() && this.cause()["toLog"]) {
            stacks = stacks + "\nCaused by:\n" + this.cause().toLog();
        }
        return errStr + "\nInformations supplémentaires :\n" + infoSupp + "\n" + stacks;
    }
}

util.inherits(BaseError, Error);
BaseError.prototype.cause = function () {
    return this.err_cause;
};
BaseError.prototype.name = "BaseError";
BaseError.prototype.toString = function () {
    let str = (this.hasOwnProperty("name") && this.name || this.constructor[ "name" ] || this.constructor.prototype.name);
    if (this.message) {
        str += ": " + this.message;
    }
    if (this.err_cause && this.err_cause.message) {
        str += "; caused by " + this.err_cause.toString();
    }
    return str;
};

if(!(Error as any).prototype.toLog) {
    (Error as any).prototype.toLog = function () {
        let errString;
        try {
            errString = JSON.stringify(this);
        } catch (err) {
            errString = "<stringifyErr>";
        }
        return (this.stack || (this.toString && this.toString()) || this) + "\n Informations supplémentaires :\n" + errString;
    }
}
