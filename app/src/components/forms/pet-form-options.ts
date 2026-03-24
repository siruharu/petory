import type { NeuteredStatus, PetSex, Species } from '../../types/domain';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

export const speciesOptions: SelectOption<Species>[] = [
  { label: '강아지', value: 'dog' },
  { label: '고양이', value: 'cat' },
];

export const petSexOptions: SelectOption<PetSex>[] = [
  { label: '남아', value: 'male' },
  { label: '여아', value: 'female' },
  { label: '모름', value: 'unknown' },
];

export const neuteredStatusOptions: SelectOption<NeuteredStatus>[] = [
  { label: '중성화 완료', value: 'neutered' },
  { label: '중성화 전', value: 'not_neutered' },
  { label: '모름', value: 'unknown' },
];

export const breedOptionsBySpecies: Record<Species, string[]> = {
  dog: [
    '말티즈',
    '푸들',
    '포메라니안',
    '비숑 프리제',
    '시추',
    '치와와',
    '골든 리트리버',
    '래브라도 리트리버',
    '웰시 코기',
    '진돗개',
    '믹스견',
  ],
  cat: [
    '코리안 숏헤어',
    '브리티시 숏헤어',
    '러시안 블루',
    '스코티시 폴드',
    '페르시안',
    '먼치킨',
    '렉돌',
    '뱅갈',
    '샴',
    '노르웨이 숲',
    '믹스묘',
  ],
};
