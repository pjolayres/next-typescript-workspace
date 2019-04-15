import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, ManyToOne } from 'typeorm';

import EventItem from './event-item';

@Entity('EventRegistrations')
export default class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  EventRegistrationId!: string;

  @Column('uuid')
  EventItemId!: string;

  @ManyToOne(_type => EventItem, item => item.EventRegistrations)
  EventItem?: EventItem;

  @Column('nvarchar', { length: 2000 })
  EmailAddress!: string;

  @Column('nvarchar', { length: 2000 })
  PhoneNumber?: string;

  @Column('nvarchar', { length: 2000 })
  Remarks?: string;

  @CreateDateColumn()
  DateCreated!: Date;

  @UpdateDateColumn()
  DateModified!: Date;

  @VersionColumn()
  Timestamp!: string;
}
