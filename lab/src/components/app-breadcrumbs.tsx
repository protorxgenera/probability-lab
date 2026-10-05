import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { trailFor } from "@/config/nav"

export function AppBreadcrumbs() {
  const { pathname } = useLocation()
  const trail = trailFor(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1
          return (
            <Fragment key={`${crumb.title}-${i}`}>
              <BreadcrumbItem>
                {isLast || !crumb.href ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={crumb.href} />}>
                    {crumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
