import { HgvAnnual } from './section-templates/hgv-annual.template';
import { PsvAnnual } from './section-templates/psv-annual.template';
import { TrlAnnual } from './section-templates/trl-annual.template';

export const masterTpl = {
  psv: {
    annual: PsvAnnual
  },
  hgv: {
    annual: HgvAnnual
  },
  trl: {
    annual: TrlAnnual
  }
};
