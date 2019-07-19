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

import { Logger } from "src/logger";
import "reflect-metadata";

declare var Reflect: any;

export interface LoggerOptions {
    level?: LogLevels;
    identification?: string;
    message?: {
        template: any;
        values?: any;
        remplaceUndef?: string;
    }
}

export default function logger(options?: LoggerOptions) {
    return function(target, key, descriptor?) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
            if (!options) {
                options = {};
            }
            if (!options.level) {
                options.level = LogLevels.INFO;
            }
            let filename = __filename.replace("../", "").replace(".js", "");
            if (options.identification) {
                filename = options.identification;
            }
            if(!target.logger){
                target.logger =  Logger.getLogger(filename);
            }
            let templatedMessage;
            let optionsValues;
            let optionsRemplaceUndef;
            if (options.message && options.message.template) {
                if (!options.message.values) {
                    optionsValues = this;
                }else{
                    optionsValues = options.message.values;
                }
                if (!options.message.remplaceUndef) {
                    optionsRemplaceUndef = "?";
                }else{
                    optionsRemplaceUndef = options.message.remplaceUndef;
                }
                templatedMessage = new Template(options.message.template).process(optionsValues, optionsRemplaceUndef);
            }
            const customLog = `${this.constructor.__proto__.name} ${key} ${templatedMessage ? templatedMessage : ""}`;
            switch(options.level) {
                case LogLevels.FATAL:
                    target.logger.fatal(customLog);
                    break;
                case LogLevels.ERROR:
                    target.logger.error(customLog);
                    break;
                case LogLevels.WARN:
                    target.logger.warn(customLog);
                    break;
                case LogLevels.INFO:
                    target.logger.info(customLog);
                    break;
                case LogLevels.DEBUG:
                    target.logger.debug(customLog);
                    break;
                case LogLevels.TRACE:
                    target.logger.trace(customLog);
                    break;
            }
            return originalMethod.apply(this, arguments);
        };
        return descriptor;
    }
}

export enum LogLevels {
    FATAL = "fatal",
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug",
    TRACE = "trace",
}

export interface Key {
    key: string;
    index: number;
    keys: string[];
}

class Template {

    protected template: string;
    protected stringKey: Array<Key>;

    /**
     * @class
     */
    constructor(template) {
        this.template = template;
        this.stringKey = [];

        const regex = /(\$\{[^\{\}\s;]+\})/g;
        let corresp = regex.exec(this.template);

        while (corresp) {
            this.stringKey.push({
                key: corresp[0],
                index: corresp.index,
                keys: corresp[0].substring(2, corresp[0].length - 1).split(/[\.\[\]]/),
            });
            corresp = regex.exec(this.template);
        }
        console.trace("hornet-js-logger.src.decorators.logger Template : ", this.template, "extract : ", this.stringKey);
    }

    /**
     * lance le templating avec un objet
     * @param {Object} obj objet servant au templating
     * @param {string} remplaceUndef remplacement si undefined
     * @return la chaine avec les valeurs remplacées
     */
    process(obj: any, remplaceUndef: string): any {
        let returnValue = this.template;
        for (const part in this.stringKey) {
            const partKey: Key = this.stringKey[ part ];
            let value = obj;
            let attr;

            for (let index = 0; index < partKey.keys.length; index++) {
                attr = partKey.keys[ index ];
                if (attr) {
                    value = value[ attr ];
                    if (typeof value === "boolean") {
                        return value;
                    } else if (typeof value === "object" && 1 === this.stringKey.length && index === (partKey.keys.length - 1)) {
                        return value;
                    } else if (!value) {
                        value = remplaceUndef;
                        break;
                    }
                }
            }
            returnValue = returnValue.replace(partKey.key, value);
        }
        console.trace("hornet-js-logger.src.decorators.logger Template generate : ", returnValue);
        return returnValue;
    }
}
