export class UserEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public phone: string,
    public type: string,
    public createdAt: Date,
    public deletedAt: Date,
  ) {}
}
