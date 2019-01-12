import t from 'tcomb';

import { Email } from './Email';

describe('Email Model', () => {
    describe('Refinement', () => {
        function testEmail(email) {
            const StructFake = t.struct({
                email: Email
            });
            return new StructFake({
                email
            });
        }

        describe('Given a valid email', () => {
            it('should validate the email', () => {
                const validEmail = 'a@b.co';
                const processedStruct = testEmail(validEmail);

                expect(processedStruct.email).toEqual(validEmail);
            });
        });

        describe('Given an invalid email', () => {
            it('should throw an error', () => {
                const invalidEmails = [
                    'a',
                    'a@',
                    'a@b',
                    'a@b.'
                ];

                invalidEmails.forEach((invalidEmail) => {
                    const getEmail = () => {
                        testEmail(invalidEmail);
                    };

                    expect(getEmail).toThrow();
                });
            });
        });
    });
});
