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
 * hornet-js-database - Ensemble des composants de gestion de base hornet-js
 *
 * @author 
 * @version v5.4.1
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Logger } from "hornet-js-logger/src/logger";
import { Sequelize, Model, ThroughOptions } from "sequelize";
import { Injector } from "hornet-js-core/src/inject/injector";
import { HornetSequelizeModel } from "src/sequelize/hornet-sequelize-model";
import { DbConnect } from "src/sequelize/dbconnect-sequelize";
import { Class } from "hornet-js-utils/src/typescript-utils";

const logger = Logger.getLogger("hornet-js-database.src.sequelize-utils");

export interface HornetSequelizeModelMap {
    name: string;
    instance: HornetSequelizeModel;
}

/**
 * Interface HornetSequelizeOptions
 * Structure les différentes options pour sequelize-utils
 */
export interface HornetSequelizeAssociationOptions {
    // fromEntity Entité correspondant au model portant la clé étrangère
    fromEntity: Class<Model<any, any>>;
    // toEntity Entité ciblée la clé étrangère
    toEntity: Class<Model<any, any>>;
    // alias Nom à donner à l'attribut au sein de l'entité fromEntity portant la clé étrangère
    alias: string;
    // nom du champs de la base de donnée portant la clé étrangère
    foreignKey: string;
    // Nom de la table issue de la relation multiple, portant une référence vers fromEntiy et une vers toEntity
    throughTable?: string | Model<any, any> | ThroughOptions;
    // otherKey Nom de l'attribut au sein de l'entité cible référence à l'entité courante (optionnel)
    otherKey?: string;
    // Cible de clé primaire autre que celle par défaut
    targetKey?: string;
    // Attribut source servant d'agrégat
    sourceKey?: string;
}

export module SequelizeUtils {
    /**
     * Initialise une relation entre deux entités de la modélisation connectées par une clé étrangère
     * @param {HornetSequelizeAssociationOptions} options
     */
    export function initRelationBelongsTo(options: HornetSequelizeAssociationOptions): void {
        if (!options.fromEntity["associations"] || (options.fromEntity["associations"]
           && !options.fromEntity["associations"][options.alias])) {
            options.fromEntity.belongsTo(options.toEntity, {
                as: options.alias,
                foreignKey: options.foreignKey,
                targetKey: options.targetKey });
        }
    }

    /**
     * Initialise une relation multiple entre deux entités de la modélisation
     * @param {HornetSequelizeAssociationOptions} options
     */
    export function initRelationBelongsToMany(options: HornetSequelizeAssociationOptions): void {
        if (!options.fromEntity["associations"]
            || (options.fromEntity["associations"] && !options.fromEntity["associations"][options.alias])) {

                options.fromEntity.belongsToMany(options.toEntity, {
                as: options.alias,
                through: options.throughTable,
                foreignKey: options.foreignKey,
                otherKey: options.otherKey });
        }
    }

    /**
     * Initialise une relation entre deux entités de la modélisation connectées par une clé étrangère
     * @param {HornetSequelizeAssociationOptions} options
     */
    export function initRelationHasOne(options: HornetSequelizeAssociationOptions) {
        if (!options.fromEntity["associations"]
            || (options.fromEntity["associations"] && !options.fromEntity["associations"][options.alias])) {
                options.fromEntity.hasOne(options.toEntity, {
                as: options.alias,
                foreignKey: options.foreignKey });
        }
    }

    /**
     * Initialise une relation entre deux entités de la modélisation connectées par une clé étrangère
     * @param {HornetSequelizeAssociationOptions} options
     */
    export function initRelationHasMany(options: HornetSequelizeAssociationOptions) {
        if (!options.fromEntity["associations"]
            || (options.fromEntity["associations"] && !options.fromEntity["associations"][options.alias])) {
                options.fromEntity.hasMany(options.toEntity, {
                as: options.alias,
                foreignKey: options.foreignKey,
                sourceKey: options.sourceKey });
        }
    }

    /**
     * Enregistre l'instance HornetSequelizeModel dans l'Injector
     * clé : HornetSequelizeModels
     * @param modelName Nom de la classe héritant de HornetSequelizeModel
     */
    export function registerModel(modelName: string, instance: HornetSequelizeModel) {
        let models: HornetSequelizeModelMap[] = Injector.getRegistered("HornetSequelizeModels");
        if (!models) {
            models = [];
        } else {
            Injector.removeRegistered("HornetSequelizeModels");
        }
        models.push({ instance, name: modelName });
        Injector.register("HornetSequelizeModels", models);
    }

    /**
     * Enregistre l'entity dans l'Injector dans un tableau
     * clé : HornetSequelizeEntities
     * @param entity Instance de l'entity
     */
    export function registerEntity(entity: any) {
        let entities = Injector.getRegistered("HornetSequelizeEntities");
        if (!entities) {
            entities = [];
        } else {
            Injector.removeRegistered("HornetSequelizeEntities");
        }
        entities.push(entity);
        Injector.register("HornetSequelizeEntities", entities);
    }

    /**
     * @param configName
     */
    export function getQuery(configName?: string): Sequelize {
        return DbConnect.global[configName || DbConnect.defaultConfigName].sequelize;
    }
}
