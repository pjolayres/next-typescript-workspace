import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, OneToMany } from 'typeorm';

import EventRegistration from './event-registration';

@Entity('EventItems')
export default class EventItem {
  @PrimaryGeneratedColumn('uuid')
  EventItemId!: string;

  @Column()
  StartDate!: Date;

  @Column({ nullable: true })
  EndDate?: Date;

  @Column('nvarchar', { length: 2000 })
  Title!: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  Summary?: string;

  @Column('text', { nullable: true })
  Body?: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  Address?: string;

  @Column('double', { nullable: true })
  Latitude?: number;

  @Column('double', { nullable: true })
  Longitude?: number;

  @OneToMany(_type => EventRegistration, item => item.EventItem)
  EventRegistrations?: EventRegistration[];

  @Column('nvarchar', { length: 2000, nullable: true })
  Remarks?: string;

  @CreateDateColumn()
  DateCreated!: Date;

  @UpdateDateColumn()
  DateModified!: Date;

  @VersionColumn()
  Timestamp!: string;
}
