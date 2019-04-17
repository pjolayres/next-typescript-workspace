import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, ManyToOne, JoinColumn } from 'typeorm';

import EventItem from './event-item';

@Entity('EventRegistrations')
export default class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  EventRegistrationId!: string;

  @Column()
  EventItemId!: string;

  @ManyToOne(_type => EventItem, item => item.EventRegistrations)
  @JoinColumn({ name: 'EventItemId' })
  EventItem!: EventItem;

  @Column('nvarchar', { length: 2000 })
  EmailAddress!: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  PhoneNumber?: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  Remarks?: string;

  @CreateDateColumn()
  DateCreated!: Date;

  @UpdateDateColumn()
  DateModified!: Date;

  @VersionColumn()
  Timestamp!: string;
}
