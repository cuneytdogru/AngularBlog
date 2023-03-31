export interface BaseDto {
  id: string;
  readonly createdDate: Date;
  readonly createdBy: string;
  readonly modifiedDate: Date;
  readonly modifiedBy: string;
}
