import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export type EntityKeyGenerator = <T>(EntityCollection?: T[]) => number | string;

export interface EntityKeyGenerators { [name: string]: EntityKeyGenerator }

export const ENTITY_KEY_GENERATORS = new InjectionToken<EntityKeyGenerators>('ENTITY_KEY_GENERATORS');

export function createEntityKeyGeneratorsProvider(generators: EntityKeyGenerators) {
  return { provide: ENTITY_KEY_GENERATORS, multi: true, useValue: generators };
}

export const defaultEntityKeyGenerators = createEntityKeyGeneratorsProvider({
  guid: weakGuid
});

export class EntityKeyGeneratorService {
  private keyGenerators: EntityKeyGenerators = { };

    constructor(@Optional() @Inject(ENTITY_KEY_GENERATORS) keyGenerators: EntityKeyGenerators[] = []) {
      keyGenerators.forEach(kg => this.registerKeyGenerators(kg));
    }

 /**
   * Get an {EntityKeyGenerator} by name.
   * @param name - Key Generator name
   *
   * Examples:
   *   getKeyGenerator('guid');// the EntityKeyGenerator fn name 'guid'
   *   getKeyGenerator();      // the generator that always returns `undefined`.
   */
  getKeyGenerator(name: string = '') {
    let keyGenerator: EntityKeyGenerator = () => undefined;
    if (name) {
      keyGenerator = this.keyGenerators[name.trim()];
      if (!keyGenerator) {
        throw new Error(`No keyGenerator named "${name}".`);
      }
    }
    return keyGenerator;
  }

  /**
   * Register an entity key generator
   * @param name - the name of the generator
   * @param keyGenerator - generator for that entity class
   *
   * Examples:
   *   registerKeyGenerator('guid', MyGuidKeyGenerator);
   */
  registerKeyGenerator(name: string, keyGenerator: EntityKeyGenerator) {
    this.keyGenerators[name.trim()] = keyGenerator;
  }

  /**
   * Register a batch of keyGenerators.
   * @param keyGenerators - keyGenerators to merge into existing keyGenerators
   *
   * Examples:
   *   registerKeyGenerators({
   *     '': MyDefaultKeyGenerator,
   *     Foo: MyFooKeyGenerator,
   *     Hero: MyHeroOnlyKeyGenerator,
   *   });
   */
  registerKeyGenerators(keyGenerators: EntityKeyGenerators) {
    this.keyGenerators = { ...this.keyGenerators, ...keyGenerators };
  }
}

/** Pseudo guid generator */
// AOT requires export
export function weakGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
