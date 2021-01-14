/* eslint-disable no-param-reassign */
import { createHash } from '../../encryption';
import MemberModel, { MemberDocument } from '../../models/member';

export type MemberQueries = {
  listMembers: () => Promise<MemberDocument>;
  selectOneMember: (id: string) => Promise<MemberDocument>;
  createMember: (document: MemberDocument) => Promise<boolean>;
  updateMember: (id: string, document: MemberDocument) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
};

export default function ({
  member,
}: {
  member: typeof MemberModel;
}): MemberQueries {
  return Object.freeze({
    listMembers() {
      return member.find({}, { password: 0 }).lean();
    },
    async selectOneMember(id: string) {
      const result = await member.findById(id, { password: 0 }).lean();

      return result;
    },
    async createMember(memberInfo: MemberDocument) {
      if (memberInfo.password) {
        const hash = await createHash(memberInfo.password);

        memberInfo.password = hash;
      }

      const result = await member.create(memberInfo);

      return !!result;
    },
    async updateMember(id: string, memberInfo: MemberDocument) {
      if (memberInfo.password) {
        const hash = await createHash(memberInfo.password);

        memberInfo.password = hash;
      }

      const result = await member.findByIdAndUpdate(id, memberInfo, {
        useFindAndModify: false,
      });

      return !!result;
    },
    async deleteMember(id: string) {
      const result = await member.findByIdAndDelete(id);

      return !!result;
    },
  });
}