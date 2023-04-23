import { Aggregate } from './aggregate';

class Human extends Aggregate {
  name!: string;

  career!: [{ name: string; stack: string[]; yearsOfEx: number }];

  profile!: { height: number; age: number };

  like!: string[];

  pet!: { profile: { name: string; breed: string }; age: number };

  constructor(args: {
    profile: { height: number; age: number };
    name: string;
    career: [{ name: string; stack: string[]; yearsOfEx: number }];
    like: string[];
    pet: { profile: { name: string; breed: string }; age: number };
  }) {
    super();
    this.profile = args.profile;
    this.name = args.name;
    this.career = args.career;
    this.like = args.like;
    this.pet = args.pet;
  }

  stripUnchangedProperty(args: {
    profile?: { height: number; age: number };
    name?: string;
    career?: [{ name: string; stack: string[]; yearsOfEx: number }];
    like?: string[];
    pet?: { profile: { name: string; breed: string }; age: number };
  }) {
    return this.stripUnchanged(args);
  }
}

describe('stripUnchanged() 테스트', () => {
  describe('args로 받은 프로퍼티중 값이 변경되지 않은 프로퍼티들만 반환한다.', () => {
    const human = new Human({
      profile: { height: 190, age: 20 },
      name: 'arthur',
      career: [{ name: 'link gather', stack: ['javascript', 'typescript'], yearsOfEx: 1 }],
      like: ['game', 'coding', 'eat'],
      pet: { profile: { name: 'link', breed: 'icon' }, age: 8 },
    });

    test('전부', () => {
      const stripped = human.stripUnchangedProperty({
        profile: { height: 180, age: 20 },
        name: 'hwang',
        career: [{ name: 'link gather', stack: ['javascript', 'typescript', 'react'], yearsOfEx: 1 }],
        like: ['game', 'eat'],
        pet: { profile: { name: 'arthur', breed: 'border collie' }, age: 1 },
      });

      expect(stripped).toEqual({
        profile: { height: 180, age: 20 },
        name: 'hwang',
        career: [{ name: 'link gather', stack: ['javascript', 'typescript', 'react'], yearsOfEx: 1 }],
        like: ['game', 'eat'],
        pet: { profile: { name: 'arthur', breed: 'border collie' }, age: 1 },
      });
    });

    test('array', () => {
      const stripped = human.stripUnchangedProperty({
        like: ['game', 'eat'],
      });

      expect(stripped).toEqual({
        like: ['game', 'eat'],
      });
    });

    test('object array', () => {
      const stripped = human.stripUnchangedProperty({
        career: [{ name: 'link gather', stack: ['javascript', 'typescript', 'react'], yearsOfEx: 1 }],
      });

      expect(stripped).toEqual({
        career: [{ name: 'link gather', stack: ['javascript', 'typescript', 'react'], yearsOfEx: 1 }],
      });
    });

    test('primitive value', () => {
      const stripped = human.stripUnchangedProperty({
        name: 'hwang',
      });

      expect(stripped).toEqual({
        name: 'hwang',
      });
    });

    test('object', () => {
      const stripped = human.stripUnchangedProperty({
        profile: { height: 180, age: 20 },
      });

      expect(stripped).toEqual({
        profile: { height: 180, age: 20 },
      });
    });

    test('nested object', () => {
      const stripped = human.stripUnchangedProperty({
        pet: { profile: { name: 'arthur', breed: 'border collie' }, age: 1 },
      });

      expect(stripped).toEqual({
        pet: { profile: { name: 'arthur', breed: 'border collie' }, age: 1 },
      });
    });
  });

  test('args로 받은 프로퍼티들이 모두 같다면 undefined를 반환한다.', () => {
    const human = new Human({
      profile: { height: 190, age: 20 },
      name: 'arthur',
      career: [{ name: 'link gather', stack: ['javascript', 'typescript'], yearsOfEx: 1 }],
      like: ['game', 'coding', 'eat'],
      pet: { profile: { name: 'link', breed: 'icon' }, age: 8 },
    });

    const stripped = human.stripUnchangedProperty({
      profile: { height: 190, age: 20 },
      name: 'arthur',
      career: [{ name: 'link gather', stack: ['javascript', 'typescript'], yearsOfEx: 1 }],
      like: ['game', 'coding', 'eat'],
      pet: { profile: { name: 'link', breed: 'icon' }, age: 8 },
    });

    expect(stripped).toBeUndefined();
  });
});
