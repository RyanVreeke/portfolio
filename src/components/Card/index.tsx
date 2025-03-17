'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardProjectData = Pick<Project, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardProjectData
  relationTo?: 'projects'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        'transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg', // Added hover animation
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-4">
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-1">{description && <p>{sanitizedDescription}</p>}</div>}
        {showCategories && hasCategories && (
          <div className="uppercase text-xs mt-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1
                const shouldInsertBreak = (index + 1) % 2 === 0 // Break after every 2nd item

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>,&nbsp;</Fragment>}
                    {shouldInsertBreak && <br />} {/* Add a break after every 2nd item */}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}
      </div>
    </article>
  )
}
