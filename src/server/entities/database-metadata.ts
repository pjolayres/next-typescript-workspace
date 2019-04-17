import { Entity, CreateDateColumn, UpdateDateColumn, VersionColumn, PrimaryColumn, Column } from 'typeorm';

@Entity('DatabaseMetadata')
export default class DatabaseMetadata {
  @PrimaryColumn('int')
  DatabaseMetadataId!: number;

  @Column('double')
  Version!: number;

  @CreateDateColumn()
  DateCreated!: Date;

  @UpdateDateColumn()
  DateModified!: Date;

  @VersionColumn()
  Timestamp!: string;
}
